<template>
    <div class="form-section padding-md">
        <div class="flex justify-between font-bold mb-8">
            <h3>{{$t('labels.event-results')}}</h3>
            <div class="flex text-blue-900 items-center cursor-pointer" @click="getReport()"> 
                <ClipboardListIcon class="h-6 w-6"/>
                <h5 class="py-1">{{$t('actions.get-report')}}</h5>
            </div>
        </div>
        <div class="grid grid-flow-row grid-cols-2 gap-6">
            <PollResultTile v-for="poll in savedPolls" :key="poll._key" :poll="poll"/>
        </div>
  </div>
</template>
<script lang="ts">

import ClipboardListIcon from 'heroicons-vue3/outline/ClipboardListIcon'
import PollResultTile from '../components/poll-result-tile.vue'

import { generateReport } from '../functions/generateReport'

import { defineComponent, PropType } from 'vue'
import { Poll, PollingEvent, Answer } from '../domain'

export default defineComponent({
    components: {
        ClipboardListIcon,
        PollResultTile,
    },
    props: {
        pollingEvent: {type: Object as PropType<PollingEvent>, required: true},
        savedPolls: {type: Array as PropType<Poll[]>, required: true}
    },
    methods: {
        async getReport():Promise<void>{
            const allAnswers = await this.getAnswers();
            const allVoters = await this.getVoters(allAnswers);

            const excelFile = generateReport(this.pollingEvent, this.savedPolls, allAnswers, allVoters.data);
            const title = this.getReportTitle();
            this.downloadReport(excelFile, title);
        },
        getAnswers(){
            return this.$client.service('answer').find({
                query: {
                    pollingEventId: this.pollingEvent._key
                }
            })
        },
        getVoters(allAnswers: Answer[]){
            const allVoterSet = new Set();
            allAnswers.forEach((ans: Answer) => {
                allVoterSet.add(ans._to);
            })
            return this.$client.service('user').find({
                query: {
                    $limit: allVoterSet.size,
                    _id: {
                        $in: [...allVoterSet]
                    }
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

