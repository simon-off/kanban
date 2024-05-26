type Card = {
  title: string;
  description?: string;
};

type Column = {
  title: string;
  cards: Card[];
};

type Board = {
  columns: Column[];
};

const board: Board = {
  columns: [
    {
      title: "Todo",
      cards: [
        { title: "Fix stuff", description: "Very important stuff!" },
        { title: "Get stuff done", description: "yes this is stuff" },
        {
          title: "Update thing",
          description:
            "long description here for all the things that needs updating. Perhaps this need to be truncated?",
        },
        { title: "Finish task", description: "Finish it!" },
      ],
    },
    {
      title: "In Progress",
      cards: [],
    },
  ],
};

function classify(input: string): string {
  return input.replaceAll(" ", "-").toLowerCase();
}

function drawCard(card: Card, columnId: string) {
  return /*html*/ `
    <article class="card" draggable="true" id="${classify(
      card.title
    )}" data-column-id="${columnId}">
      <header>
        <h3>${card.title}</h3>
      </header>
      <div class="body">
        ${card.description ? /*html*/ `<p>${card.description}</p>` : ``}
      </div>
    </article>
  `;
}

function drawColumn(column: Column) {
  return /*html*/ `
    <section class="column" id="${classify(column.title)}">
      <h2>${column.title}</h2>
      <div class="cards">${column.cards
        .map((card) => drawCard(card, classify(column.title)))
        .join("")}</div>
    </section>
  `;
}

export function drawBoard(): HTMLDivElement {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  const sectionsEl = board.columns.map(drawColumn).join("");
  boardEl.innerHTML = sectionsEl;

  const cards = boardEl.querySelectorAll<HTMLDivElement>(".card");

  for (const card of cards) {
    card.addEventListener("dragstart", (ev: DragEvent) => {
      if (!ev.dataTransfer) return;

      ev.dataTransfer.setData("text/plain", card.id);
    });
  }

  const columns = boardEl.querySelectorAll<HTMLElement>(".column");

  for (const column of columns) {
    column.addEventListener("dragover", (ev) => {
      if (!ev.dataTransfer) return;

      ev.preventDefault();
      ev.dataTransfer.dropEffect = "move";
    });

    column.addEventListener("drop", (ev: DragEvent) => {
      if (ev.dataTransfer === null) return;

      ev.preventDefault();
      const cardId = ev.dataTransfer.getData("text/plain");
      const cardEl = document.querySelector<HTMLDivElement>(`#${cardId}`);

      const oldColumn = board.columns.find(
        (x) => classify(x.title) === cardEl?.dataset.columnId
      );
      const card = oldColumn?.cards.find(
        (card) => classify(card.title) === cardId
      );
      const newColumn = board.columns.find(
        (x) => classify(x.title) === (ev.target as HTMLElement)?.id
      );

      if (!card) return;

      newColumn?.cards.push(card);
      oldColumn?.cards.splice(oldColumn.cards.indexOf(card), 1);

      console.log(board);
      const mainEl = document.querySelector<HTMLDivElement>("main");

      if (!mainEl) return;
      mainEl.innerHTML = "";
      mainEl.appendChild(drawBoard());
    });
  }

  return boardEl;
}
