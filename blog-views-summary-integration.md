# Blog Views Summary — Frontend Integration

## Endpoint

```
GET /api/blog/views/summary
```

No auth required. Cached 10 minutes via middleware.

## Response

```json
{
  "total": 130,
  "daily": {
    "2026-07-20": 50,
    "2026-07-21": 80
  }
}
```

| Field | Type | Description |
|---|---|---|
| `total` | `number` | All-time views across all blog posts |
| `daily` | `Record<string, number>` | Views per day (key = `YYYY-MM-DD`) |

**Note:** `daily` only contains days with ≥1 view. Days with zero views are absent from the map.

## Usage

### Fetch summary

```ts
const res = await fetch("/api/blog/views/summary");
const { total, daily } = await res.json();
```

### Render daily chart

```ts
const dates = Object.keys(daily).sort();
const values = dates.map(d => daily[d]);
```

### Get today's views

```ts
const today = new Date().toISOString().slice(0, 10); // "2026-07-23"
const todayViews = daily[today] ?? 0;
```

### Get this week's views

```ts
const weekAgo = new Date();
weekAgo.setDate(weekAgo.getDate() - 7);
const weekAgoStr = weekAgo.toISOString().slice(0, 10);

const weekViews = Object.entries(daily)
  .filter(([date]) => date >= weekAgoStr)
  .reduce((sum, [, count]) => sum + count, 0);
```

### Bar chart example (plain HTML)

```html
<div id="chart"></div>

<script>
  const data = await fetch("/api/blog/views/summary").then(r => r.json());
  const dates = Object.keys(data.daily).sort();
  const max = Math.max(...dates.map(d => data.daily[d]));

  document.getElementById("chart").innerHTML = dates.map(date => {
    const pct = (data.daily[date] / max) * 100;
    return `
      <div style="margin:4px 0">
        <span>${date}</span>
        <div style="background:#3b82f6;width:${pct}%;height:20px"></div>
        <span>${data.daily[date]}</span>
      </div>`;
  }).join("");
</script>
```

## Rate limiting

Standard rate limit applies (10 req/min). No special headers needed.
