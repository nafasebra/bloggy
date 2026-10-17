# syntax=docker/dockerfile:1
# Community MinIO is source-only. Build a pinned official release, including
# the embedded object-browser console, rather than relying on legacy images.
FROM golang:1.25-alpine AS builder
ARG MINIO_VERSION=RELEASE.2025-10-15T17-29-55Z
RUN apk add --no-cache git
WORKDIR /src
RUN git clone --depth 1 --branch "$MINIO_VERSION" https://github.com/minio/minio.git .
RUN --mount=type=cache,target=/go/pkg/mod \
    --mount=type=cache,target=/root/.cache/go-build \
    CGO_ENABLED=0 go build -trimpath -ldflags="-s -w" -o /out/minio .

FROM alpine:3.22 AS runner
RUN apk add --no-cache ca-certificates curl \
    && addgroup -S -g 1001 minio \
    && adduser -S -D -u 1001 -G minio minio \
    && mkdir /data && chown minio:minio /data
COPY --from=builder /out/minio /usr/local/bin/minio
COPY --from=builder /src/LICENSE /licenses/minio/LICENSE
USER minio
EXPOSE 9000 9001
ENTRYPOINT ["minio"]
CMD ["server", "/data", "--console-address", ":9001"]
