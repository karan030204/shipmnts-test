import { error, log } from 'console';
import { app } from './app';
import connectDb from './db/index';

const port = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log('Error while connecting db', error);
  });
