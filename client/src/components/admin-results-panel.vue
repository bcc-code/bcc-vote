<template>
    <div class="form-section padding-md">
        <div class="flex justify-between font-bold mb-8">
            <h3>{{$t('labels.event-results')}}</h3>
            <div class="flex text-blue-900 items-center cursor-pointer" @click="generateReport()"> 
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

// import { Workbook } from 'excel4node/source/index.js'

import { defineComponent, PropType } from 'vue'
import { Poll, PollingEvent, Answer, Option } from '../domain'

export default defineComponent({
    components: {
        ClipboardListIcon,
        PollResultTile,
    },
    props: {
        pollingEvent: {type: Object as PropType<PollingEvent>, required: true},
        savedPolls: {type: Array as PropType<Poll[]>, required: true}
    },
    data(){
        return{
            answerMap: {} as {[answerId: number]: { pollIndex: number, answer:Option}},
            workSheets: {} as {[pollId: string]: any},
            workBook: {} as any,
            allAnswers: [] as Answer[],
            voterMap: {} as {[voterId: string]: any}
        }
    },
    methods: {
        async generateReport():Promise<void>{
            const xl = require('excel4node')
            this.workBook = new xl.Workbook()

            this.createSheets();

            this.allAnswers = await this.getAnswers()
            const votersList = await this.getVoters()

            this.getVotersMap(votersList.data)

            this.fillAnswerData()

            const fileName = this.getReportTitle();
            this.downloadReport(this.workBook, fileName)
            
        },
        fillAnswerData(){
            console.log(this.workSheets)
            this.allAnswers.forEach((answer: Answer) => {
                const ws = this.workSheets[answer._from]
                this.fillDataRow(ws, answer)
            })
        },
        fillDataRow(ws: any, ans: Answer){
            const {personID, displayName, age, email, churchName, cellPhone, activeRole} = this.voterMap[ans._to]
            const row = ws.lastUsedRow + 1;
            ws.cell(row, 1).number(personID)
            ws.cell(row, 2).string(displayName)
            ws.cell(row, 3).number(age)
            ws.cell(row, 4).string(email)
            ws.cell(row, 5).string(cellPhone.formatted)
            ws.cell(row, 6).string(churchName)
            ws.cell(row, 7).string(activeRole)
            // ws.cell(row, 8).number(ans.answerId)
        },
        createSheets(){
            this.savedPolls.forEach((poll:Poll) => {
                const ws = this.workBook.addWorksheet(poll.title)
                ws.cell(1, 1, 1, 6, true).string(poll.title)
                ws.cell(2, 1, 3, 6, true).string(poll.description)
                ws.column(2).setWidth(50)
                this.workSheets[poll._id] = ws
            })
        },
        getAnswers(){
            return this.$client.service('answer').find({
                query: {
                    pollingEventId: this.pollingEvent._key
                }
            })
        },
        getVoters(){
            const allVoterSet = new Set();
            this.allAnswers.forEach((ans: Answer) => {
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
        getVotersMap(votersList: any[]){
            votersList.forEach((voter: any) => {
                this.voterMap[voter._id] = voter
            });
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

