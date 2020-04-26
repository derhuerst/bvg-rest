# bvg-rest

***bvg-rest* is a public transport REST API**, a clean alternative to the [BVG HAFAS API](https://github.com/public-transport/hafas-client/blob/0466e570ad3fcdc952dc99da1ef30a084ab79f13/p/bvg/readme.md).

[API Documentation](docs/index.md) | [Why?](docs/why.md)

![bvg-rest architecture diagram](architecture.svg)

[![Docker build status](https://img.shields.io/docker/build/derhuerst/bvg-rest.svg)](https://hub.docker.com/r/derhuerst/bvg-rest/)
![ISC-licensed](https://img.shields.io/github/license/derhuerst/bvg-rest.svg)
[![chat with me on Gitter](https://img.shields.io/badge/chat%20with%20me-on%20gitter-512e92.svg)](https://gitter.im/derhuerst)
[![support me on Patreon](https://img.shields.io/badge/support%20me-on%20patreon-fa7664.svg)](https://patreon.com/derhuerst)


## installing & running

### via Docker

A Docker image [is available as `derhuerst/bvg-rest`](https://hub.docker.com/r/derhuerst/bvg-rest).

```shell
docker run -d -p 3000:3000 derhuerst/bvg-rest
```

### manually

```shell
git clone https://github.com/derhuerst/bvg-rest.git
cd bvg-rest
git checkout 2
npm install --production
npm start
```

To keep the API running permanently, use tools like [`forever`](https://github.com/foreverjs/forever#forever) or [`systemd`](https://wiki.debian.org/systemd).


## Related Projects

- [`vbb-modules`](https://github.com/derhuerst/vbb-modules) – List of JavaScript modules for Berlin & Brandenburg public transport.
- [`bvg-hafas`](https://github.com/public-transport/bvg-hafas) – JavaScript client for the BVG HAFAS API.
- [`db-rest`](https://github.com/derhuerst/db-rest) – A clean REST API wrapping around the Deutsche Bahn API.
- [`hvv-rest`](https://github.com/derhuerst/hvv-rest) – A clean REST API wrapping around the HVV API.


## Contributing

If you have a question or need support using `bvg-rest`, please double-check your code and setup first. If you think you have found a bug or want to propose a feature, refer to [the issues page](https://github.com/derhuerst/bvg-rest/issues).
