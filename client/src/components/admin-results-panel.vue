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
            answerMap: {} as {[answerId: number]: { pollIndex: number, answer:Option}}
        }
    },
    methods: {
        async generateReport():Promise<void>{
            const xl = require('excel4node')
            const wb = new xl.Workbook()

            const workSheets:any[] = [];

            this.savedPolls.forEach((poll:Poll) => {
                const ws = wb.addWorksheet(poll.title)
                ws.cell(1, 1, 1, 6, true).string(poll.title)
                ws.cell(2, 1, 3, 6, true).string(poll.description)
                ws.column(1).setWidth(50);
                workSheets.push({sheet: ws, currentRow: 4});
            })

            this.getAnswerMap();

            const allAnswers:Answer[] = await this.$client.service('answer').find({
                query: {
                    pollingEventId: this.pollingEvent._key
                }
            })
            
            allAnswers.forEach((ans: Answer) => {
                const sheetIndex = this.answerMap[ans.answerId].pollIndex
                const currSheet = workSheets[sheetIndex].sheet
                const currRow = workSheets[sheetIndex].currentRow
                currSheet.cell(currRow, 1).string(ans.displayName)
                currSheet.cell(currRow, 2).number(ans.answerId);
                workSheets[sheetIndex].currentRow ++;
            })

            const fileName = this.getReportTitle();
            this.downloadReport(wb, fileName)
            
        },
        getAnswerMap():void{
            for(let i = 0; i < this.savedPolls.length; i++){
                this.savedPolls[i].answers.forEach((opt:Option) => {
                    this.answerMap[opt.answerId] = {pollIndex: i, answer:opt}
                })
            }
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

