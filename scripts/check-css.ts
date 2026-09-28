async function check() {
  const res = await fetch('http://localhost:3000/demo')
  const html = await res.text()
  const cssMatch = html.match(/href="(\/_next\/static\/[^"]+\.css[^"]*)"/)
  console.log('CSS path in HTML:', cssMatch ? cssMatch[1] : 'NOT FOUND')
  if (cssMatch && cssMatch[1]) {
    const cssRes = await fetch('http://localhost:3000' + cssMatch[1])
    console.log('CSS HTTP Status:', cssRes.status, 'Content-Type:', cssRes.headers.get('content-type'))
    const cssText = await cssRes.text()
    console.log(
      'CSS bytes:', cssText.length,
      '\nContains .app-shell:', cssText.includes('.app-shell'),
      '\nContains .sidebar:', cssText.includes('.sidebar'),
      '\nContains .topbar:', cssText.includes('.topbar'),
      '\nContains --primary:', cssText.includes('--primary'),
      '\nContains --ink:', cssText.includes('--ink')
    )
  }
}
check()
