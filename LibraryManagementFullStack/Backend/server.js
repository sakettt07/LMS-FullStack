import { app } from "./app.js";
import "colors"

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`.bgMagenta.bold.white);
});