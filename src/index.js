import "./style.css";
import logo from "./images/logo.png";

document.getElementById("app").innerText = "by Ismail :)";

const img = document.createElement("img");
img.classList.add("logo");
img.src = logo;
document.body.appendChild(img);
