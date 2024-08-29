const app = require('./app')
const logger = require('./utils/logger')
const config = require('./utils/configs')

app.listen(config.PORT, () => {logger.info(`Server is listening on port ${config.PORT}`)})