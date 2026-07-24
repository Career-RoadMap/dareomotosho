<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> · RSS feed</title>
        <style>
          *{box-sizing:border-box;margin:0;padding:0}
          body{font-family:Georgia,'Times New Roman',serif;background:#F7F5F0;color:#0F1B2D;line-height:1.65}
          .wrap{max-width:720px;margin:0 auto;padding:48px 24px 80px}
          .banner{background:#1E3A5F;color:#F7F5F0;border-radius:12px;padding:16px 20px;font-family:Arial,sans-serif;font-size:.85rem;line-height:1.6}
          .banner strong{color:#E0A951}
          .banner code{background:rgba(247,245,240,.12);border-radius:4px;padding:2px 6px;font-size:.8rem}
          header{margin-top:40px;border-bottom:3px solid #E0A951;padding-bottom:24px}
          .kicker{font-family:Arial,sans-serif;font-size:11px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#E0A951}
          h1{font-size:2.2rem;font-weight:400;line-height:1.15;margin-top:10px}
          .desc{margin-top:10px;color:#555;font-style:italic}
          .site-link{display:inline-block;margin-top:14px;font-family:Arial,sans-serif;font-size:.85rem;font-weight:600;color:#1E3A5F;text-decoration:none;border-bottom:1px solid #E0A951}
          article{padding:28px 0;border-bottom:1px solid rgba(15,27,45,.1)}
          article h2{font-size:1.3rem;font-weight:500;line-height:1.3}
          article h2 a{color:#0F1B2D;text-decoration:none}
          article h2 a:hover{color:#1E3A5F;border-bottom:1px solid #E0A951}
          .meta{margin-top:6px;font-family:Arial,sans-serif;font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;color:#999}
          .meta .topic{color:#E0A951;font-weight:700}
          article p.summary{margin-top:10px;color:#444;font-size:.95rem}
          footer{margin-top:36px;font-family:Arial,sans-serif;font-size:.75rem;color:#999;text-align:center}
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="banner">
            <strong>This is an RSS feed.</strong> Copy the address in your
            browser's URL bar into any feed reader (Feedly, Inoreader,
            NetNewsWire, and others) to get new resources automatically.
          </div>
          <header>
            <p class="kicker">RSS feed</p>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>
            <a class="site-link" href="{/rss/channel/link}">Visit dareomotosho.com →</a>
          </header>
          <main>
            <xsl:for-each select="/rss/channel/item">
              <article>
                <h2><a href="{link}"><xsl:value-of select="title"/></a></h2>
                <p class="meta">
                  <span class="topic"><xsl:value-of select="category"/></span>
                  <xsl:if test="pubDate"> · <xsl:value-of select="pubDate"/></xsl:if>
                </p>
                <p class="summary"><xsl:value-of select="description"/></p>
              </article>
            </xsl:for-each>
          </main>
          <footer>dareomotosho.com · updated automatically as new resources publish</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
