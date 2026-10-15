# Load and stress testing

The backend exposes Prometheus metrics on a separate internal port (9464) when `METRICS_ENABLED=true`. Prometheus scrapes it every five seconds. Grafana provisions the Prometheus data source and the **Bloggy — API and k6 Performance** dashboard from version-controlled files. k6 sends results to Prometheus using its remote-write output.

From the repository root:

```sh
docker compose --profile monitoring up -d --build backend prometheus grafana
```

Open http://localhost:3002/d/bloggy-performance. Login uses `GRAFANA_ADMIN_USER` and `GRAFANA_ADMIN_PASSWORD` in the root `.env` (example defaults: `admin` / `change-me-now`). Set a personal password before the first start; Grafana persists its account and dashboards in a named volume. Prometheus is at http://localhost:9090. Neither UI is bound to external host interfaces.

Run separately, so bringing up monitoring never starts a stress test:

```sh
# Normal load: 0 → 10 VUs → sustained traffic → 0
docker compose run --rm -e RUN_ID=load-001 k6

# Stress: staged increase to 100 VUs, hold, and recovery
docker compose run --rm -e RUN_ID=stress-001 k6 run --out experimental-prometheus-rw /scripts/stress.js

# Small smoke test
docker compose run --rm -e RUN_ID=smoke-001 -e VUS=1 -e RAMP_DURATION=1s -e HOLD_DURATION=3s k6
```

Use a different `RUN_ID` for each run and filter by it in Grafana. Finished series are marked stale; select a time range covering the run to review results. Backend panels also work without k6. k6 metrics appear only after a test runs. Stop monitoring with `docker compose --profile monitoring stop grafana prometheus`; volumes retain seven days of Prometheus history and Grafana configuration.

The workload reads `/posts` and `/posts/search` and verifies status 200 and JSON arrays. It does not mutate data or test login, authenticated flows, browser rendering, or WebSockets. An empty database is a valid functional smoke target, but meaningful performance measurements require representative data and production-like resources. Rate-limit responses count as failed requests.

## Configuration and interpretation

| Environment variable | Load default | Stress default |
| --- | --- | --- |
| `BASE_URL` | `http://backend:3030` | same |
| `VUS` | 10 | unused |
| `MAX_VUS` | unused | 100 |
| `RAMP_DURATION` | 30s each direction | unused |
| `STEP_DURATION` | unused | 1m per step |
| `HOLD_DURATION` | 2m | 2m |
| `RECOVERY_DURATION` | unused | 1m |
| `THINK_TIME` | 1 second | 1 second |
| `P95_MS` | 500 milliseconds | 1500 milliseconds |

Load fails above 1% HTTP failures or below 99% successful checks. Stress permits up to 5% failures and aborts after its initial 30-second evaluation delay when that failure threshold is exceeded. Both exit nonzero when latency thresholds fail. Thresholds are starting targets, not measured capacity guarantees. These are closed-model VU tests: throughput falls as responses slow down. Watch both backend metrics and k6 metrics, including the recovery period.

For a local backend, enable `METRICS_ENABLED=true` and target `BASE_URL=http://host.docker.internal:3030` from k6. The default Prometheus scrape target assumes the backend runs in Compose; update `docker/monitoring/prometheus.yml` if scraping a host process. Metrics contain route templates and status codes, not cookies, tokens, query strings, or raw user IDs. The metrics listener is internal-only in Compose and is disabled by default outside Docker.

## Validation

```sh
docker compose --profile monitoring --profile loadtest config --quiet
docker compose run --rm --no-deps k6 inspect /scripts/load.js
docker compose run --rm --no-deps k6 inspect /scripts/stress.js
```

Performance tests are opt-in and are not run on ordinary CI pushes. The HTTP instrumentation regression test runs with the normal backend unit suite. Run heavy tests against an environment whose load you intend to measure, separately from the shared development database.
