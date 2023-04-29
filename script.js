const imagem = document.querySelector("#image");
const pallet = document.querySelector("#pallet");
const info = document.querySelector(".container-right");
const board = document.querySelector(".container-left");
const inputImage = document.querySelector("#inputImagem");
const imgSelection = document.querySelector(".input-label");

let xy = [0, 0];

const removeChilds = (parent) => {
  while (parent.firstChild) {
    info.removeChild(info.firstChild);
  }
  return;
};

const removeItsSelf = (elem) => elem.parentNode.removeChild(elem);

// Functions
const getColor = (x, y) => {
  const canvas = document.createElement("canvas");

  canvas.width = imagem.width;
  canvas.height = imagem.height;
  canvas.style.display = "none";
  document.body.appendChild(canvas);

  const context = canvas.getContext("2d");
  context.drawImage(imagem, 0, 0);
  const data = context.getImageData(x, y, 1, 1).data;

  const hex =
    "#" +
    [...data]
      .map((x) => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("");

  const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;

  return { rgb, hex };
};

const createText = (text, type) => {
  const mainDiv = document.createElement("div");
  const spanText = document.createElement("span");
  const spanCode = document.createElement("span");

  mainDiv.classList.add("color-code");
  spanText.id = "color-type";
  spanCode.id = "color-type";

  spanText.innerText = type + ":";
  spanCode.innerText = text;

  info.appendChild(mainDiv);
  mainDiv.appendChild(spanText);
  mainDiv.appendChild(spanCode);

  return;
};

const createBlock = (rbg) => {
  const block = document.createElement("span");

  block.style.backgroundColor = rbg;
  block.id = "pallet";
  info.appendChild(block);

  return;
};

const markDot = (x, y) => {
  const isThereADot = document.querySelector("#pointer-dot");

  if (!!isThereADot) removeItsSelf(isThereADot);

  const dot = document.createElement("div");
  dot.classList.add("dot");

  dot.id = "pointer-dot";

  dot.style.left = x + "px";
  dot.style.top = y + "px";
  dot.style.display = "block";

  document.body.appendChild(dot);

  return;
};

// Events
const handleChange = (event) => {
  xy[0] = event.offsetX;
  xy[1] = event.offsetY;
  return;
};

const handleClick = () => {
  const { rgb, hex } = getColor(...xy);

  removeChilds(info);
  createText(rgb, "RGB");
  createText(hex, "HEX");
  createBlock(rgb);
  markDot(...xy);

  return;
};

const imageSelection = () => {
  const file = inputImage.files[0];
  const files = inputImage.files;

  if (files && file) {
    const leitor = new FileReader();

    leitor.readAsDataURL(file); // read file

    leitor.onload = function () {
      const img = new Image();
      img.src = leitor.result;

      img.onload = function () {
        imagem.src = img.src;

        info.style.visibility = "visible";
        board.style.visibility = "visible";
        imgSelection.style.visibility = "hidden";
      };
    };
  }
};

// Actions
imagem.addEventListener("load", () => {
  imagem.addEventListener("mousemove", handleChange);
  imagem.addEventListener("click", handleClick);
});

inputImage.addEventListener("change", imageSelection);
