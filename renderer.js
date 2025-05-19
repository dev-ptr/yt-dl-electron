    const urlInput = document.getElementById('urlInput')
    const mp3OnlyCheckbox = document.getElementById('mp3Only')
    const downloadBtn = document.getElementById('downloadBtn')
    const quitBtn = document.getElementById('quitBtn')
    const log = document.getElementById('log')

    downloadBtn.addEventListener('click', () => {
      const url = urlInput.value.trim()
      if (!url) {
        alert('Please enter a URL')
        return
      }
      log.textContent = ''
      window.electronAPI.downloadUrl(url, mp3OnlyCheckbox.checked)
    })

    quitBtn.addEventListener('click', () => {
      window.electronAPI.quitApp()
    })

    window.electronAPI.onDownloadLog((data) => {
      log.textContent += data.replace(/\r?\n/g, '\n')
      log.scrollTop = log.scrollHeight
    })

    window.electronAPI.onDownloadComplete((code) => {
      log.textContent += `\nDownload process exited with code ${code}\n`
    })