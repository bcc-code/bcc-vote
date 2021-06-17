import { Poll, Answer, Option } from "@/domain/Poll"
import { PollingEvent } from "@/domain/PollingEvent"

const columnWidth = [10, 40, 5, 30, 30, 20, 20, 20, 30, 20]

export const generateReport = (pollingEvent: PollingEvent, savedPolls: Poll[], allAnswers: Answer[], allVoters: any[]) => {
    const xl = require('excel4node')
    const workBook = new xl.Workbook({
        defaultFont: {
        },
        dateFormat: 'yyyy-mm-dd hh:mm:ss'
    })
    
    const workSheets = createSheets(savedPolls, workBook, pollingEvent);
    const answerMap = getAnswerMap(savedPolls)
    const voterMap = getVoterMap(allVoters);

    fillAnswerData(allAnswers, workSheets, voterMap, answerMap);

    return workBook;
}

const fillAnswerData = (allAnswers: Answer[], workSheets:any, voterMap:any, answerMap: any) => {
    allAnswers.forEach((answer: Answer) => {
        const ws = workSheets[answer._from]
        fillDataRow(ws, answer, voterMap, answerMap)
    })
}
const fillDataRow = (ws: any, ans: Answer, voterMap: any, answerMap:any) => {
    const {personID, displayName, age, email, churchName, cellPhone, activeRole} = voterMap[ans._to]
    const row = ws.lastUsedRow + 1;
    ws.cell(row, 1).number(personID)
    ws.cell(row, 2).string(displayName)
    ws.cell(row, 3).number(age)
    ws.cell(row, 4).string(email)
    ws.cell(row, 5).string(cellPhone.formatted)
    ws.cell(row, 6).string(churchName)
    ws.cell(row, 7).string(activeRole)
    ws.cell(row, 8).string(answerMap[ans.answerId])
    ws.cell(row, 9).date(new Date(ans.lastChanged))
}
const createSheets = (savedPolls: Poll[], workBook: any, pollingEvent: PollingEvent) => {
    const workSheets = {} as {[pollId: string]: any}
    savedPolls.forEach((poll:Poll) => {
        const ws = workBook.addWorksheet(poll.title)
        workSheets[poll._id] = ws
    })
    const firstSheet = workSheets[savedPolls[0]._id]
    fillPollingEventInfo(firstSheet, pollingEvent)

    savedPolls.forEach((poll:Poll) => {
        fillPollInfo(workSheets[poll._id], poll)
    })
    return workSheets
}
const fillPollInfo = (ws: any, poll: Poll) => {
    const startRow = ws.lastUsedRow + 2
    ws.cell(startRow, 1, startRow, 8, true).string(poll.title)
    ws.cell(startRow, 9).date(new Date(poll.lastChanged))
    if(poll.description)
        ws.cell(startRow + 1, 1, startRow + 2, 9, true).string(poll.description)
    for(let i = 0; i < columnWidth.length; i++){
        ws.column(i + 1).setWidth(columnWidth[i]);
    }
    ws.cell(ws.lastUsedRow + 1).string("")
}
const fillPollingEventInfo = (ws: any, event:PollingEvent) => {
    const startRow = ws.lastUsedRow + 1;
    ws.cell(startRow, 1, startRow, 8, true).string(event.title)
    ws.cell(startRow, 9).date(new Date(event.startDateTime));
    if(event.description)
        ws.cell(startRow + 1, 1, startRow + 2, 9, true).string(event.description)
}

const getAnswerMap = (savedPolls: Poll[]) => {
    const answerMap = {} as {[answerId: string]: string}
    savedPolls.forEach((poll:Poll) => {
        poll.answers.forEach((opt: Option) => {
            answerMap[opt.answerId] = opt.label;
        })
    })
    return answerMap
}

const getVoterMap = (allVoters: any[]) => {
    const voterMap = {} as {[id: string]: any}
    allVoters.forEach((voter: any) => {
        voterMap[voter._id] = voter
    });
    return voterMap
}