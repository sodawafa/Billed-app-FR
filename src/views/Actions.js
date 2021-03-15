import eyeBlueIcon from "../assets/svg/eye_blue.js"
import downloadBlueIcon from "../assets/svg/download_blue.js"

export default (fileName,billUrl) => {
  return (
    `<div class="icon-actions actions-view">
      <div id="eye" data-testid="icon-eye" data-bill-url=${billUrl}>
      ${eyeBlueIcon}
      </div>
      <p class="eye-title">${fileName}</p>
    </div>`
  )
}
