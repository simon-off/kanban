type Card = {
  title: string;
  description?: string;
};

type Board = Record<string, Card[]>;

const board: Board = {
  todo: [
    { title: "Fix stuff", description: "Very important stuff!" },
    { title: "Get stuff done", description: "yes this is stuff" },
    {
      title: "Update thing",
      description:
        "long description here for all the things that needs updating. Perhaps this need to be truncated?",
    },
    { title: "Finish task", description: "Finish it!" },
  ],
  "in-progress": [],
};

function classify(input: string): string {
  return input.replaceAll(" ", "-").toLowerCase();
}

function drawCard(card: Card, columnId: string) {
  const cardEl = document.createElement("article");
  cardEl.classList.add("card");
  cardEl.draggable = true;
  cardEl.id = classify(card.title);
  cardEl.dataset.columnId = columnId;
  cardEl.innerHTML = /*html*/ `
    <header>
      <h3>${card.title}</h3>
    </header>
    <div class="body">
      ${card.description ? /*html*/ `<p>${card.description}</p>` : ``}
    </div>
  `;

  cardEl.addEventListener("dragstart", (ev: DragEvent) => {
    if (!ev.dataTransfer) return;

    console.log("hallå");

    ev.dataTransfer.setData("text/plain", cardEl.id);
  });

  return cardEl;
}

function drawColumn(key: string, cards: Card[]) {
  const columnEl = document.createElement("section");
  columnEl.classList.add("column");
  columnEl.id = classify(key);
  columnEl.innerHTML = /*html*/ `
    <h2>${key}</h2>
    <div class="cards"></div>
  `;

  columnEl
    .querySelector(".cards")
    ?.append(...cards.map((card) => drawCard(card, classify(key))));

  columnEl.addEventListener("dragover", (ev) => {
    if (!ev.dataTransfer) return;
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  });

  columnEl.addEventListener("drop", (ev: DragEvent) => {
    if (ev.dataTransfer === null) return;

    ev.preventDefault();
    const cardId = ev.dataTransfer.getData("text/plain");
    const cardEl = document.getElementById(cardId);

    const oldColumn = board[cardEl?.dataset.columnId ?? ""];
    const newColumn =
      board[(ev.target as HTMLElement)?.querySelector("h2")?.innerText ?? ""];
    const card = oldColumn.find((card) => classify(card.title) === cardId);

    if (!oldColumn || !newColumn || !card) return;

    newColumn?.push(card);
    oldColumn?.splice(oldColumn.indexOf(card), 1);

    const mainEl = document.querySelector<HTMLDivElement>("main");

    if (!mainEl) return;
    mainEl.innerHTML = "";
    mainEl.appendChild(drawBoard());
  });

  return columnEl;
}

export function drawBoard(): HTMLDivElement {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  boardEl.append(
    ...Object.entries(board).map(([key, value]) => drawColumn(key, value))
  );

  return boardEl;
}
