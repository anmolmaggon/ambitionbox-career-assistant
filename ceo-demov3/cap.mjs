import { chromium } from '@playwright/test'
const shots = [
  ['home', '/home?preset=tracker', null],
  ['tracker', '/tracker?preset=tracker', null],
  ['tracker-board', '/tracker?preset=tracker&view=board', null],
  ['flow-ghosted', '/flow/ghosted?application=pinelabs-app&preset=tracker', 3200],
  ['flow-offer', '/flow/offer?preset=offer', 3200],
  ['flow-rejection', '/flow/rejection?application=navi-app&preset=tracker', 4200],
  ['jobs', '/matches?preset=matches', null],
  ['job-zeta', '/jobs/zeta?preset=matches', null],
  ['job-groww', '/jobs/razorline?preset=matches', null],
]
const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 430, height: 940 }, deviceScaleFactor: 2 })
for (const [name, url, wait] of shots) {
  await p.goto('http://127.0.0.1:4273' + url)
  await p.waitForTimeout(wait || 1400)
  await p.screenshot({ path: `/tmp/northshots/${name}.png`, fullPage: false })
}
await b.close()
console.log('done')
