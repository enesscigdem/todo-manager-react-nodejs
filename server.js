const app = require('./app');
const init = require('./src/config');

const PORT = process.env.PORT || 3001;

init()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message);
  });
