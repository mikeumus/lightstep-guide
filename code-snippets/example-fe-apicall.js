
let section = instr.start(`api-${path}`, parentSpan);
section.info('Request', { path, url, data });

return new Promise((resolve, reject) => {
    api
        .post(url)
        .withCredentials()
        .set('Content-Type', 'application/json; charset=utf-8')
        .set(section.carrier())
        .send(JSON.stringify(data))
        .end((err, res) => {
            if (err) {
                if (res) {
                    err.body = res.body;
                }
                return reject(err);
            }
            return resolve(res.body);
        });
    })
    .then((json) => {
        section.info('response', json);
        section.finish();
        return json;
    })
    .catch((err) => {
    console.error('API error', path, data);
        section.error('error', err);
        section.finish();

        throw err;
    });
