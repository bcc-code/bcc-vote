<template>
    <div class="form-section padding-md">
        <div class="flex justify-between font-bold mb-8">
            <h3>{{$t('labels.event-results')}}</h3>
            <div v-if="startedPolls.length" class="flex text-blue-900 items-center cursor-pointer" @click="getReport()" :class="{'opacity-50': loadingReport}"> 
                <ClipboardListIcon class="h-6 w-6"/>
                <h5 class="py-1">{{$t('actions.get-report')}}</h5>
            </div>
        </div>
        <Spinner v-if="loadingReport"/>
        <div class="grid grid-flow-row grid-cols-2 gap-6" :class="{'opacity-50': loadingReport}">
            <PollResultTile v-for="poll in startedPolls" :key="poll._key" :poll="poll"/>
        </div>
  </div>
</template>
<script lang="ts">

import ClipboardListIcon from 'heroicons-vue3/outline/ClipboardListIcon'
import PollResultTile from '../components/poll-result-tile.vue'
import Spinner from '../components/spinner.vue'

import { generateReport } from '../functions/generateReport'

import { defineComponent, PropType } from 'vue'
import { Poll, PollingEvent, Answer, PollActiveStatus } from '../domain'

export default defineComponent({
    components: {
        ClipboardListIcon,
        PollResultTile,
        Spinner
    },
    props: {
        pollingEvent: {type: Object as PropType<PollingEvent>, required: true},
        savedPolls: {type: Array as PropType<Poll[]>, required: true}
    },
    data(){
        return {
            usersPerBatch: 50,
            loadingReport: false
        }
    },
    computed: {
        startedPolls():Array<Poll>{
            return this.savedPolls.filter((poll:Poll) => {return poll.activeStatus !== PollActiveStatus['Not Started']})
        }
    },
    methods: {
        async getReport():Promise<void>{
            if(this.loadingReport)
                return;
            this.loadingReport = true
            const allAnswers = await this.getAnswers()
            const allVoters = await this.getVoters(allAnswers)
            const allResults = await this.getResults()

            const excelFile = generateReport(this.pollingEvent, this.startedPolls, allAnswers, allVoters, allResults)
            
            this.loadingReport = false
            const title = this.getReportTitle()
            this.downloadReport(excelFile, title)
        },
        getAnswers(){
            return this.$client.service('answer').find({
                query: {
                    pollingEventId: this.pollingEvent._key
                }
            })
        },
        async getVoters(allAnswers: Answer[]){
            const allVoterSet = new Set();
            allAnswers.forEach((ans: Answer) => {
                allVoterSet.add(ans._to);
            })
            const voterArray = [...allVoterSet]
            let promises = []
            let result = [] as any[]
            while(voterArray.length > 0){
                const voterSubset = voterArray.splice(0, this.usersPerBatch)
                promises.push(this.$client.service('user').find({
                    query: {
                        $limit: voterSubset.length,
                        _id: {
                            $in: voterSubset
                        }
                    }
                }).then((r:any) => {
                    result = result.concat(r.data)
                }).catch(this.$handleError))
            }
            await Promise.all(promises)
            return result
        },
        getResults(){
            return this.$client.service('poll-result').find({
                query: {
                    pollingEventId: this.pollingEvent._key
                }
            })
        },
        getReportTitle():string{
            const pollDate = this.pollingEvent.startDateTime.toLocaleString().split('T')[0]
            const timeStamp = new Date().getTime();
            const fileName = `${this.pollingEvent.title} ${pollDate} ${timeStamp}`
            return fileName
        },
        downloadReport(wb:any, name:string):void{
            wb.writeToBuffer().then((buffer:any) => {
                const blob = new Blob([buffer], {type: 'application/xlsx'})
                const link = document.createElement('a')
                link.href = URL.createObjectURL(blob)
                link.download = `${name}.xlsx`
                link.click()
                URL.revokeObjectURL(link.href)
            })
        }
    }
})
</script>

