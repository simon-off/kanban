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
  return input.replace(" ", "-").toLowerCase();
}

function drawCard(card: Card) {
  return /*html*/ `
    <article class="card" draggable="true">
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
    <section class="column ${classify(column.title)}">
      <h2>${column.title}</h2>
      <div class="cards">${column.cards.map(drawCard).join("")}</div>
    </section>
  `;
}

export function drawBoard(): HTMLDivElement {
  const boardEl = document.createElement("div");
  boardEl.classList.add("board");

  const sectionsEl = board.columns.map(drawColumn).join("");

  boardEl.innerHTML = sectionsEl;
  const cards = boardEl.querySelectorAll(".column");
  for (const card of cards) {
    card.addEventListener("dragstart", (ev) => {
      console.log(ev);
    });
    card.addEventListener("dragover", (ev) => {
      console.log(ev);
    });
  }
  return boardEl;
}
