import marimo

__generated_with = "0.15.5"
app = marimo.App(width="medium")


@app.cell
def _():
    import pandas as pd
    import seaborn as sns
    import sqlalchemy
    import matplotlib.pyplot as plt
    import marimo as mo
    return mo, pd, plt, sns, sqlalchemy


@app.cell
def _(sns):
    sns.set(font_scale = .4, rc={"figure.dpi":300, 'savefig.dpi':300})
    sns.set_style("whitegrid", {'axes.grid' : False})
    return


@app.cell
def _(sqlalchemy):
    DATABASE_URL = "sqlite:////Users/roshanmurthy/codebases_mbpm1/official-mcp-registry-database/official_mcp_registry.db"
    engine = sqlalchemy.create_engine(DATABASE_URL)
    return (engine,)


@app.cell
def _(engine, pd):
    df = pd.read_sql_table("servers", engine)
    filtered_df = df[df["server_type"]!="unknown"]
    return (filtered_df,)


@app.cell(hide_code=True)
def _(mo):
    mo.md(r"""# MCP Server Counts""")
    return


@app.cell
def _(filtered_df):
    total_distinct_servers = len(filtered_df)
    return (total_distinct_servers,)


@app.cell
def _(mo, total_distinct_servers):
    mo.md(f"""## There are currently **{total_distinct_servers}** MCP servers total in the official registry""")
    return


@app.cell
def _(filtered_df, sns):
    h = sns.histplot(data=filtered_df,x="server_type")
    h.set_title("Distribution of MCP Server Types")
    h.set_xlabel("Server Type")
    h.set_ylabel("Count")
    h.figure.set_figwidth(2)
    h.figure.set_figheight(2)
    return (h,)


@app.cell
def _(h):
    h
    return


@app.cell
def _(mo):
    mo.md(r"""# Growth over time""")
    return


@app.cell
def _(filtered_df, pd):
    # Convert published_at to datetime and extract date
    filtered_df['published_date'] = pd.to_datetime(filtered_df['published_at']).dt.date

    # Count servers by date
    servers_by_date = filtered_df.groupby('published_date').size()

    # Calculate cumulative sum of servers over time
    cumulative_servers = servers_by_date.cumsum()
    return cumulative_servers, servers_by_date


@app.cell
def _(cumulative_servers, plt, servers_by_date):
    # Create a combined plot with cumulative servers (line) and new servers (bar)
    fig, ax1 = plt.subplots(figsize=(6, 3))

    # Bar plot for new servers (servers_by_date)
    ax1.bar(servers_by_date.index, servers_by_date.values, alpha=0.6, color='skyblue', label='New Servers')
    ax1.set_xlabel('Date')
    ax1.set_ylabel('New Servers', color='skyblue')
    ax1.tick_params(axis='y', labelcolor='skyblue')

    # Create second y-axis for cumulative servers
    ax2 = ax1.twinx()
    ax2.plot(cumulative_servers.index, cumulative_servers.values, color='darkblue', marker='.', linewidth=2, label='Cumulative Servers')
    ax2.set_ylabel('Cumulative Servers', color='darkblue')
    ax2.tick_params(axis='y', labelcolor='darkblue')
    ax2.axis(ymin=0)

    # Add value label to last cumulative data point
    last_date = cumulative_servers.index[-1]
    last_value = cumulative_servers.values[-1]
    ax2.annotate(str(last_value), 
                 xy=(last_date, last_value),
                 xytext=(5, -1), 
                 textcoords='offset points',
                 fontsize=6,
                 color='black',
                 ha='left',
                 va='bottom')

    plt.title('MCP Servers: Daily New vs Cumulative Total')
    fig.tight_layout()

    return (fig,)


@app.cell
def _(fig):
    fig
    return


if __name__ == "__main__":
    app.run()
