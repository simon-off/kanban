import "./scss/main.scss";
import * as board from "./board.ts";

document.querySelector<HTMLDivElement>("main")?.appendChild(board.drawBoard());
