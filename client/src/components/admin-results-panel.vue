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
            answerMap: {} as {[answerId: string]: string},
            workSheets: {} as {[pollId: string]: any},
            workBook: {} as any,
            allAnswers: [] as Answer[],
            voterMap: {} as {[voterId: string]: any},
            columnWidth: [10, 40, 5, 20, 30, 20, 20, 20, 30, 20],
        }
    },
    methods: {
        async generateReport():Promise<void>{
            const xl = require('excel4node')
            this.workBook = new xl.Workbook({
                defaultFont: {
                },
                dateFormat: 'yyyy-mm-dd hh:mm:ss'
            })

            this.createSheets();

            this.allAnswers = await this.getAnswers()
            const votersList = await this.getVoters()

            this.getVotersMap(votersList.data)
            this.getAnswerMap();
            this.fillAnswerData()

            const fileName = this.getReportTitle();
            this.downloadReport(this.workBook, fileName)
            
        },
        fillAnswerData(){
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
            ws.cell(row, 8).string(this.answerMap[ans.answerId])
            ws.cell(row, 9).date(new Date(ans.lastChanged))
        },
        createSheets(){
            this.savedPolls.forEach((poll:Poll) => {
                const ws = this.workBook.addWorksheet(poll.title)
                this.workSheets[poll._id] = ws
            })
            const firstSheet = this.workSheets[this.savedPolls[0]._id]
            this.fillPollingEventInfo(firstSheet, this.pollingEvent)
            
            this.savedPolls.forEach((poll:Poll) => {
                this.fillPollInfo(this.workSheets[poll._id], poll)
            })
        },
        fillPollInfo(ws: any, poll: Poll){
            const startRow = ws.lastUsedRow + 2
            ws.cell(startRow, 1, startRow, 8, true).string(poll.title)
            ws.cell(startRow, 9).date(new Date(poll.lastChanged))
            if(poll.description)
                ws.cell(startRow + 1, 1, startRow + 2, 9, true).string(poll.description)
            for(let i = 0; i < this.columnWidth.length; i++){
                ws.column(i + 1).setWidth(this.columnWidth[i]);
            }
            ws.cell(ws.lastUsedRow + 1).string("")
        },
        fillPollingEventInfo(ws: any, event:PollingEvent){
            const startRow = ws.lastUsedRow + 1;
            ws.cell(startRow, 1, startRow, 8, true).string(event.title)
            ws.cell(startRow, 9).date(new Date(event.startDateTime));
            if(event.description)
                ws.cell(startRow + 1, 1, startRow + 2, 9, true).string(event.description)
            
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
        getAnswerMap(){
            this.savedPolls.forEach((poll:Poll) => {
                poll.answers.forEach((opt: Option) => {
                    this.answerMap[opt.answerId] = opt.label;
                })
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

