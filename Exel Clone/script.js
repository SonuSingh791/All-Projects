defaultProperties = {
  text: "",
  "font-family": "serif",
  "font-size": "16px",
  "font-weight": "",
  "font-style": "",
  "text-decoration": "",
  "text-align": "left",
  "background-color": "#ffffff",
  color: "#000000",
};
let cellData = {
  Sheet1: {},
};
let selectedSheet = "Sheet1";
let totalSheets = 1;
let lastlyAddedSheet = 1;

$(document).ready(function () {
  for (let i = 1; i <= 100; i++) {
    let ans = "";
    let n = i;
    while (n > 0) {
      let rem = n % 26;
      if (rem == 0) {
        ans = "Z" + ans;
        n = Math.floor(n / 26) - 1;
      } else {
        ans = String.fromCharCode(rem - 1 + 65) + ans;
        n = Math.floor(n / 26);
      }
    }
    let column = $(
      `<div class="column-name colId-${i}" id="colCode-${ans}">${ans}</div>`
    );
    $(".column-name-container").append(column);
    let row = $(`<div class="row-name" id="rowId-${i}">${i}</div>`);
    $(".row-name-container").append(row);
  }
  for (let i = 1; i <= 100; i++) {
    let row = $(`<div class="cell-row"></div>`);
    for (let j = 1; j <= 100; j++) {
      let colCode = $(`.colId-${j}`).attr("id").split("-")[1];
      let column = $(
        `<div class="input-cell" contenteditable="false" id="row-${i}-col-${j}" data="code-${colCode}"></div>`
      );
      row.append(column);
    }
    $(".input-cell-container").append(row);
  }

  $(".icon-align").click(function () {
    $(".icon-align.selected").removeClass("selected");
    $(this).addClass("selected");
  });

  $(".style-icon").click(function () {
    $(this).toggleClass("selected");
  });

  $(".input-cell").click(function (e) {
    if (e.metaKey) {
      let [rowId, colId] = getRowCol(this);
      if (rowId > 1) {
        let topCellSelected = $(`#row-${rowId - 1}-col-${colId}`).hasClass(
          "selected"
        );
        if (topCellSelected) {
          // console.log("top");
          $(this).addClass("top-cell-selected");
          $(`#row-${rowId - 1}-col-${colId}`).addClass("bottom-cell-selected");
        }
      }
      if (rowId < 100) {
        let bottomCellSelected = $(`#row-${rowId + 1}-col-${colId}`).hasClass(
          "selected"
        );
        if (bottomCellSelected) {
          // console.log("bottom");
          $(this).addClass("bottom-cell-selected");
          $(`#row-${rowId + 1}-col-${colId}`).addClass("top-cell-selected");
        }
      }
      if (colId > 1) {
        let leftCellSelected = $(`#row-${rowId}-col-${colId - 1}`).hasClass(
          "selected"
        );
        if (leftCellSelected) {
          // console.log("left");

          $(this).addClass("left-cell-selected");
          $(`#row-${rowId}-col-${colId - 1}`).addClass("right-cell-selected");
        }
      }
      if (colId < 100) {
        let rightCellSelected = $(`#row-${rowId}-col-${colId + 1}`).hasClass(
          "selected"
        );
        if (rightCellSelected) {
          // console.log("right");

          $(this).addClass("right-cell-selected");
          $(`#row-${rowId}-col-${colId + 1}`).addClass("left-cell-selected");
        }
      }
      //   $(this).addClass("selected");
    } else {
      $(".input-cell.selected").removeClass("selected");
      //   $(this).addClass("selected");
    }
    $(this).addClass("selected");
    changeHeader(this);
  });

  $(".input-cell").dblclick(function () {
    $(".input-cell.selected").removeClass("selected");
    $(this).addClass("selected");
    $(this).attr("contenteditable", "true");
    $(this).focus();
  });

  $(".input-cell").blur(function () {
    $(".input-cell.selected").attr("contenteditable", "false");
    updateCell("text", $(this).text());
  });
  $(".input-cell-container").scroll(function () {
    $(".column-name-container").scrollLeft(this.scrollLeft);
    $(".row-name-container").scrollTop(this.scrollTop);
  });
});
function changeHeader(ele) {
  let [rowId, colId] = getRowCol(ele);
  let cellInfo = defaultProperties;
  if (cellData[selectedSheet][rowId] && cellData[selectedSheet][rowId][colId]) {
    cellInfo = cellData[selectedSheet][rowId][colId];
  }
  cellInfo["font-weight"]
    ? $(".icon-bold").addClass("selected")
    : $(".icon-bold").removeClass("selected");
  cellInfo["font-style"]
    ? $(".icon-italic").addClass("selected")
    : $(".icon-italic").removeClass("selected");
  cellInfo["text-decoration"]
    ? $(".icon-underline").addClass("selected")
    : $(".icon-underline").removeClass("selected");
  let alignment = cellInfo["text-align"];
  $(".icon-align.selected").removeClass("selected");
  $(".icon-align-" + alignment).addClass("selected");
  $(".background-color-picker").val(cellInfo["background-color"]);
  $(".text-color-picker").val(cellInfo["color"]);
  $(".font-size-selector").val(cellInfo["font-size"]);
  $(".font-family-selector").val(cellInfo["font-family"]);
  $(".font-family-selector").css("font-family", cellInfo["font-family"]);
}
function getRowCol(ele) {
  idArr = $(ele).attr("id").split("-");
  let rowId = parseInt(idArr[1]);
  let colId = parseInt(idArr[3]);
  return [rowId, colId];
}

function updateCell(property, value, defaultPossible) {
  $(".input-cell.selected").each(function () {
    $(this).css(property, value);
    let [rowId, colId] = getRowCol(this);
    if (cellData[selectedSheet][rowId]) {
      if (cellData[selectedSheet][rowId][colId]) {
        cellData[selectedSheet][rowId][colId][property] = value;
      } else {
        cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
        cellData[selectedSheet][rowId][colId][property] = value;
      }
    } else {
      cellData[selectedSheet][rowId] = {};
      cellData[selectedSheet][rowId][colId] = { ...defaultProperties };
      cellData[selectedSheet][rowId][colId][property] = value;
    }
    if (
      defaultPossible &&
      JSON.stringify(cellData[selectedSheet][rowId][colId]) ===
        JSON.stringify(defaultProperties)
    ) {
      delete cellData[selectedSheet][rowId][colId];
      if (Object.keys(cellData[selectedSheet][rowId]).length == 0) {
        delete cellData[selectedSheet][rowId];
      }
    }
  });
}

$(".icon-bold").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("font-weight", "", true);
  } else {
    updateCell("font-weight", "bold", false);
  }
});

$(".icon-italic").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("font-style", "", true);
  } else {
    updateCell("font-style", "italic", false);
  }
});

$(".icon-underline").click(function () {
  if ($(this).hasClass("selected")) {
    updateCell("text-decoration", "", true);
  } else {
    updateCell("text-decoration", "underline", false);
  }
});

$(".icon-align-left").click(function () {
  if (!$(this).hasClass("selected")) {
    updateCell("text-align", "left", true);
  }
});

$(".icon-align-center").click(function () {
  if (!$(this).hasClass("selected")) {
    updateCell("text-align", "center", true);
  }
});

$(".icon-align-right").click(function () {
  if (!$(this).hasClass("selected")) {
    updateCell("text-align", "right", true);
  }
});

$(".color-fill-icon").click(function () {
  $(".background-color-picker").click();
});

$(".color-text-icon").click(function () {
  $(".text-color-picker").click();
});

$(".background-color-picker").change(function () {
  updateCell("background-color", $(this).val());
});

$(".text-color-picker").change(function () {
  updateCell("color", $(this).val());
});

$(".font-family-selector").change(function () {
  updateCell("font-family", $(this).val());
  $(".font-family-selector").css("font-family", $(this).val());
});

$(".font-size-selector").change(function () {
  updateCell("font-size", $(this).val());
});

function emptySheet() {
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      $(`#row-${i}-col-${j}`).text("");
      $(`#row-${i}-col-${j}`).css("font-family", "serif");
      $(`#row-${i}-col-${j}`).css("font-size", "16px");
      $(`#row-${i}-col-${j}`).css("font-weight", "");
      $(`#row-${i}-col-${j}`).css("font-style", "");
      $(`#row-${i}-col-${j}`).css("text-decoration", "");
      $(`#row-${i}-col-${j}`).css("text-align", "left");
      $(`#row-${i}-col-${j}`).css("background-color", "#ffffff");
      $(`#row-${i}-col-${j}`).css("color", "$000000");
    }
  }
}

function loadSheet() {
  let sheetInfo = cellData[selectedSheet];
  for (let i of Object.keys(sheetInfo)) {
    for (let j of Object.keys(sheetInfo[i])) {
      let cellInfo = cellData[selectedSheet][i][j];
      $(`#row-${i}-col-${j}`).text(cellInfo["text"]);
      $(`#row-${i}-col-${j}`).css("font-family", cellInfo["font-family"]);
      $(`#row-${i}-col-${j}`).css("font-size", cellInfo["font-size"]);
      $(`#row-${i}-col-${j}`).css("font-weight", cellInfo["font-weight"]);
      $(`#row-${i}-col-${j}`).css("font-style", cellInfo["font-style"]);
      $(`#row-${i}-col-${j}`).css(
        "text-decoration",
        cellInfo["text-decoration"]
      );
      $(`#row-${i}-col-${j}`).css("text-align", cellInfo["text-align"]);
      $(`#row-${i}-col-${j}`).css(
        "background-color",
        cellInfo["background-color"]
      );
      $(`#row-${i}-col-${j}`).css("color", cellInfo["color"]);
    }
  }
}

$(".icon-add").click(function () {
  emptySheet();
  $(".sheet-tab.selected").removeClass("selected");
  let sheetName = "Sheet" + (lastlyAddedSheet + 1);
  cellData[sheetName] = {};
  lastlyAddedSheet += 1;
  totalSheets += 1;
  selectedSheet = sheetName;
  $(".sheet-tab-container").append(
    `<div class="sheet-tab selected">${sheetName}</div>`
  );
  addSheetEvents();
});
function addSheetEvents() {
  $(".sheet-tab.selected").click(function () {
    if (!$(this).hasClass("selected")) {
      selectSheet(this);
    }
  });
}
$(".sheet-tab.selected").contextmenu(function (e) {
  console.log("i'm selected");
  e.preventDefault();
  selectSheet(this);
  // $(".sheet-tab.selected").removeClass("selected");
  // $(this).addClass("selected");
  // selectedSheet = $(this).text();
  if ($(".sheet-options-model").length == 0) {
    $(".container").append(`<div class="sheet-options-model">
                                    <div class="sheet-rename">Rename</div>
                                    <div class="sheet-delete">Delete</div>
                                </div>`);
    $(".sheet-options-model").css("left", e.pageX + "px");
  }
    $(".sheet-rename").click(function () {
      $(".container").append(`<div class="rename-options-model">
                                        <h4 class="model-title">Rename Sheet To:</h4>
                                        <input type="text" class="new-sheet-name" placeholder="Sheet Name"/>
                                        <div class="action-buttons">
                                            <div class="cancel-button">Cancel</div>
                                            <div class="submit-button">Rename</div>
                                        </div>
                                    </div>`);
                                    
      $(".cancel-button").click(function () {
        $(".rename-options-model").remove();
      });

      $(".submit-button").click(function () {
        let newSheetName = $(".new-sheet-name").val();
        $(".sheet-tab.selected").text(newSheetName);
        let newCellData = {};
        for (let key in cellData) {
          if (key != selectedSheet) {
            newCellData[key] = cellData[key];
          } else {
            newCellData[newSheetName] = cellData[key];
          }
        }
        cellData = newCellData;
        selectedSheet = newSheetName;
        $(".rename-options-model").remove();
      });
    });

    $(".sheet-delete").click(function () {
      if (Object.keys(cellData).length > 1) {
        let currSheetName = selectedSheet;
        let currSheet = $(".sheet-tab.selected");
        let currSheetIndex = Object.keys(cellData).indexOf(selectedSheet);
        if (currSheetIndex == 0) {
          $(".sheet-tab.selected").next().click();
        } else {
          $(".sheet-tab.selected").prev().click();
        }
        delete cellData[currSheetName];
        currSheet.remove();
      } else {
        alert("Sorry,there is only one sheet.So you can't delete it.");
      }
    });
});

$(".container").click(function () {
  $(".sheet-options-model").remove();
});

$(".icon-left-scroll").click(function() {
    $(".sheet-tab.selected").prev().click();
});

$(".icon-right-scroll").click(function() {
    $(".sheet-tab.selected").next().click();
});

addSheetEvents();

function selectSheet(ele) {
  $(".sheet-tab.selected").removeClass("selected");
  $(ele).addClass("selected");
  emptySheet();
  selectedSheet = $(ele).text();
  loadSheet();
}
