exports.options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kortex Backend Service',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:5000'
            }
        ]

    },
    apis: [
        './v1/routers/*.js'
    ]
}