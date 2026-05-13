const ws = require('ws')
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://lbatmgvrqvjchbodzymy.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYXRtZ3ZycXZqY2hib2R6eW15Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzNDQwMDEsImV4cCI6MjA5MzkyMDAwMX0.qRZ6rs0Eu55xDNqaHNlASjuxDCLXB9kzbO8ySNgvbPo', { realtime: { transport: ws } })
async function main() {
  let allMeds = new Set()
  let from = 0
  while (true) {
    const res = await supabase.from('precos').select('medicamento').range(from, from + 999)
    if (!res.data || res.data.length === 0) break
    res.data.forEach(p => allMeds.add(p.medicamento))
    from += 1000
    if (res.data.length < 1000) break
  }
  console.log('Total medicamentos únicos:', allMeds.size)
  console.log('Alguns:', [...allMeds].slice(0,10).join(', '))
}
main()
