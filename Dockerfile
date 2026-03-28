FROM ghcr.io/userver-framework/ubuntu-24.04-userver:latest

WORKDIR /app

COPY . .

RUN cmake --preset release \
    && cmake --build build-release -j --target fitness_tracker_service

CMD ["./build-release/fitness_tracker_service", "--config", "configs/static_config.yaml", "--config_vars", "configs/config_vars.docker.yaml"]
