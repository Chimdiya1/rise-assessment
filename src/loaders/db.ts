import { initialiseDataSource } from "../data-source";


export default (): Promise<void> =>
  initialiseDataSource().then((isInitialised: boolean) => {
    if (isInitialised) {
      console.log(`DataSource has been initialised!`);
    } else {
      console.error(`Could not initialise database connection`);
      process.exit(1)
    }
  });
