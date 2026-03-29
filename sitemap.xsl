<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">

    <xsl:output method="html" encoding="UTF-8" indent="yes"/>

    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <title>XML Sitemap - SEVO | Simat Elkhair Voluntary Organization</title>
                <style>
                    :root {
                        --bg-color: #ffffff;
                        --bg-hero: #ffe8cc;
                        --text-main: #7F4145;
                        --text-muted: #8B5A5E;
                        --text-light: #A67073;
                        --radius-card: 20px;
                    }

                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }

                    body {
                        font-family: 'Oswald', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                        background: linear-gradient(135deg, #fff5f5 0%, #fffae8 100%);
                        color: var(--text-main);
                        line-height: 1.6;
                        padding: 40px 20px;
                        min-height: 100vh;
                    }

                    .container {
                        max-width: 1200px;
                        margin: 0 auto;
                    }

                    header {
                        text-align: center;
                        margin-bottom: 40px;
                        padding: 40px;
                        background: white;
                        border-radius: var(--radius-card);
                        box-shadow: 0 4px 20px rgba(127, 65, 69, 0.1);
                    }

                    header h1 {
                        font-size: 2.5rem;
                        font-weight: 700;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        margin-bottom: 12px;
                        color: var(--text-main);
                    }

                    header p {
                        color: var(--text-muted);
                        font-size: 1.1rem;
                    }

                    header a {
                        color: var(--text-main);
                        text-decoration: none;
                    }

                    header a:hover {
                        opacity: 0.7;
                    }

                    .sitemap-info {
                        background: white;
                        border-radius: var(--radius-card);
                        padding: 30px;
                        margin-bottom: 30px;
                        box-shadow: 0 4px 20px rgba(127, 65, 69, 0.1);
                    }

                    .sitemap-info h2 {
                        font-size: 1.5rem;
                        margin-bottom: 16px;
                        color: var(--text-main);
                    }

                    .sitemap-info p {
                        color: var(--text-muted);
                        margin-bottom: 12px;
                    }

                    .sitemap-info ul {
                        list-style: none;
                        padding-left: 0;
                    }

                    .sitemap-info li {
                        padding: 8px 0;
                        color: var(--text-muted);
                    }

                    .sitemap-info li strong {
                        color: var(--text-main);
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        background: white;
                        border-radius: var(--radius-card);
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(127, 65, 69, 0.1);
                    }

                    thead {
                        background: var(--bg-hero);
                    }

                    th {
                        padding: 18px 16px;
                        text-align: left;
                        font-weight: 600;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                        font-size: 0.85rem;
                        color: var(--text-main);
                    }

                    td {
                        padding: 16px;
                        border-bottom: 1px solid rgba(127, 65, 69, 0.1);
                    }

                    tr:last-child td {
                        border-bottom: none;
                    }

                    tr:hover {
                        background: rgba(255, 232, 204, 0.3);
                    }

                    .url-cell {
                        font-weight: 500;
                    }

                    .url-cell a {
                        color: var(--text-main);
                        text-decoration: none;
                        word-break: break-all;
                    }

                    .url-cell a:hover {
                        text-decoration: underline;
                    }

                    .priority-high {
                        color: #22c55e;
                        font-weight: 600;
                    }

                    .priority-medium {
                        color: #f59e0b;
                        font-weight: 600;
                    }

                    .frequency {
                        text-transform: capitalize;
                        color: var(--text-muted);
                    }

                    footer {
                        text-align: center;
                        margin-top: 40px;
                        padding: 20px;
                        color: var(--text-muted);
                        font-size: 0.9rem;
                    }

                    footer a {
                        color: var(--text-main);
                        text-decoration: none;
                    }

                    footer a:hover {
                        opacity: 0.7;
                    }

                    @media (max-width: 768px) {
                        body {
                            padding: 20px 12px;
                        }

                        header h1 {
                            font-size: 1.8rem;
                        }

                        table {
                            font-size: 0.85rem;
                        }

                        th, td {
                            padding: 12px 8px;
                        }

                        .priority-high, .priority-medium {
                            font-size: 0.8rem;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <header>
                        <h1>
                            <a href="https://simat-elkhair.org/">SEVO</a>
                        </h1>
                        <p>XML Sitemap - Simat Elkhair Voluntary Organization</p>
                    </header>

                    <div class="sitemap-info">
                        <h2>About This Sitemap</h2>
                        <p>This sitemap helps search engines like Google, Bing, and Yahoo discover and index all pages on our website more efficiently.</p>
                        <ul>
                            <li><strong>Total URLs:</strong> <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></li>
                            <li><strong>Last Updated:</strong> <xsl:value-of select="sitemap:urlset/sitemap:url[1]/sitemap:lastmod"/></li>
                            <li><strong>Domain:</strong> simat-elkhair.org</li>
                        </ul>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>URL</th>
                                <th>Last Modified</th>
                                <th>Change Frequency</th>
                                <th>Priority</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="sitemap:urlset/sitemap:url">
                                <tr>
                                    <td class="url-cell">
                                        <a href="{sitemap:loc}" target="_blank" rel="noopener">
                                            <xsl:value-of select="sitemap:loc"/>
                                        </a>
                                    </td>
                                    <td>
                                        <xsl:value-of select="sitemap:lastmod"/>
                                    </td>
                                    <td class="frequency">
                                        <xsl:value-of select="sitemap:changefreq"/>
                                    </td>
                                    <td>
                                        <xsl:choose>
                                            <xsl:when test="sitemap:priority &gt;= 0.9">
                                                <span class="priority-high">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:when>
                                            <xsl:otherwise>
                                                <span class="priority-medium">
                                                    <xsl:value-of select="sitemap:priority"/>
                                                </span>
                                            </xsl:otherwise>
                                        </xsl:choose>
                                    </td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>

                    <footer>
                        <p>
                            This is an XML Sitemap generated for search engines. 
                            For more information, visit the 
                            <a href="https://www.sitemaps.org/" target="_blank" rel="noopener">Sitemaps protocol</a>.
                        </p>
                        <p style="margin-top: 12px;">
                            © 2026 SEVO - Simat Elkhair Voluntary Organization
                        </p>
                    </footer>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
