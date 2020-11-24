

module.exports = (articles, name_magazine, description) => {
  let htmlArticles = '';
  articles.forEach(article => {
    htmlArticles += `
      <div class="content-summary">
        <h3 style="color: #196844;">${article.title}</h3>
        <p style="font-size: 0.95em;color: #7c7979">Autores: ${article.authors}</p>
        <p style="font-size: 0.95em;color: #7c7979"> URL:
          <a style="color: #2d2df8;text-decoration: none;" href="${article.urlHtml}" target="_blank"
            rel="noopener noreferrer">
            ${article.urlHtml}
          </a>
        </p>
        <hr style=" background: #dfdfdf;height: 2px;border: none;" />
      </div>
    `
  })

  const summaryDescription = description ? `
    <div class="content-summary">
      <h3 style="color: #196844; text-align: center;">Descripción del sumario</h3>
      <p style="font-size: 0.95em;color: #7c7979">${description}</p>
      <hr style=" background: #dfdfdf;height: 2px;border: none;" />
    </div>
  `: ''

  return `
  <div style="max-width: 700px;
              min-height: 500px;
              background-color: #fafbfa;
              margin: 0 auto;">
    <div style="background-color: #196844;
                color: #ffffff;
                font-family: sans-serif;
                position: relative;
                margin-top: 20px;
                margin: 0 auto;
                max-width: 700px;
                width: 100%;
                display: inline-block;" >
      <div style=" width: 48%;display: inline-block;float: left;">
        <img src="https://www.politecnicojic.edu.co/images/logo/logo.png" alt="Logo politecnico jic" style="width: 250px; max-width: 100%;">
      </div>
      <div style="margin-top: 3.3%;width: 48%;font-size:1.3em;text-align:right; margin-right:10px; display: inline-block;float: right;">Sumario - ${name_magazine}</div>
    </div>
    <div style="font-family: sans-serif;padding: 10px 30px;">
      ${summaryDescription}
      ${htmlArticles}
    </div>
  </div>
  `
}