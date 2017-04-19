"use strict";function initDB(){playerDB=new PouchDB("player",{adapter:"websql",revs_limit:10}),scoreDB=new PouchDB("score",{adapter:"websql",revs_limit:10}),turn=1,playerDB.get("p1").catch(function(e){return dbUpdatePlayers([{_id:"p1",name:"Player 1",score:0},{_id:"p2",name:"Player 2",score:0},{_id:"p3",name:"Player 3",score:0},{_id:"p4",name:"Player 4",score:0}])}).then(function(e){dbFetchPlayers().then(function(e){uiUpdateName(e),uiUpdateScores(e)}),dbFetchLogs().then(uiFillLogs),dbFetchTurn()})}function dbFetchPlayers(){return playerDB.allDocs({include_docs:!0})}function dbUpdatePlayers(e){return playerDB.bulkDocs(e)}function dbFetchName(e){return playerDB.get(e)}function dbUpdateName(e,t){return playerDB.get(e).then(function(e){return e.name=t,playerDB.put(e)})}function dbUpdateScores(e){var t=[];return dbFetchPlayers().then(function(n){for(var r=0;r<4;r++)t[r]=n.rows[r].doc,t[r].score+=e[r];dbUpdatePlayers(t)})}function dbFetchTurn(){scoreDB.info().then(function(e){turn=e.doc_count+1})}function dbUpdateLog(e){return scoreDB.put({_id:turn+"",p1:e[0],p2:e[1],p3:e[2],p4:e[3]})}function dbFetchLogs(){return scoreDB.allDocs({include_docs:!0})}function dialogDismissal(e){if("button"!==e.target.type){var t=e.target.getBoundingClientRect(),n=t.left+e.target.clientLeft,r=t.top+e.target.clientTop;(e.clientX<n||e.clientX>=n+e.target.clientWidth||e.clientY<r||e.clientY>=r+e.target.clientHeight)&&e.target.close()}}function uiUpdateName(e){for(var t=1;t<=4;t++){var n=e.rows[t-1].doc.name,r=n.length>8?n.substr(0,8)+"..":n;n=n.length>12?n.substr(0,12)+"..":n,$("#p"+t).html(n),$("#p"+t+"th").html(r)}}function uiUpdateScores(e){for(var t=1;t<=4;t++){var n=e.rows[t-1].doc.score;$("#p"+t+"score").html(n),$("#p"+t+"cscore").html("")}$(".game-turn-number").html(turn)}function uiUpdateCScore(e){$("#"+e+"cscore").removeClass(),$("#scoreInput").val()>0?($("#"+e+"cscore").html(" +"+$("#scoreInput").val()),$("#"+e+"cscore").addClass("positive-score")):$("#scoreInput").val()<0?($("#"+e+"cscore").html(" "+$("#scoreInput").val()),$("#"+e+"cscore").addClass("negative-score")):$("#"+e+"cscore").html("")}function uiUpdatePlayerDialog(e){var t=""!=$("#"+e+"cscore").html()?parseInt($("#"+e+"cscore").html(),10):0;dbFetchName(e).then(function(e){$("#nameInput").val(e.name)}),$("#nameInput").parent().addClass("is-dirty"),$("#scoreInput").parent().removeClass("is-invalid"),$("#scoreInput").parent().addClass("is-dirty"),$("#scoreInput").val(t),$("#scoreInput").focus()}function uiUpdateLog(e){turn++;for(var t="<tr><td>"+(turn-1)+"</td>",n=0;n<4;n++)t+="<td>"+e[n]+"</td>",3==n&&(t+="</tr>");$(t).insertAfter(".current-turn"),$(".turn-number").html(turn)}function uiFillLogs(e){for(var t,n=0;n<e.rows.length;n++)t=e.rows[n].doc,uiUpdateLog(Object.keys(t).map(function(e){return t[e]}))}function uiClearLogs(){$("#scoreBody").html('<tr class="current-turn">         <td class="turn-number">1</td>         <td> ... </td>         <td> ... </td>         <td> ... </td>         <td> ... </td>       </tr>')}function validateScore(e,t){$("#scoreInput").val()%5==0?e():($("#scoreInput").focus(),$("#scoreInput").parent().addClass("is-invalid"),$("#scoreInput").parent().addClass("is-dirty"),t())}function toastScoreInvalid(){var e={message:"Score must be divisible by 5"};document.querySelector("#scoreInvalidToast").MaterialSnackbar.showSnackbar(e)}window.onload=function(){$(".init-spinner").removeClass("is-active")};var playerDB,scoreDB,turn;initDB();var playerDialog=document.querySelector(".player-dialog"),submitDialog=document.querySelector(".submit-dialog"),resetDialog=document.querySelector(".reset-dialog"),submitFab=document.querySelector("#submitFab");submitDialog.showModal||(dialogPolyfill.registerDialog(playerDialog),dialogPolyfill.registerDialog(submitDialog),dialogPolyfill.registerDialog(resetDialog)),playerDialog.addEventListener("click",dialogDismissal),submitDialog.addEventListener("click",dialogDismissal),resetDialog.addEventListener("click",dialogDismissal),submitFab.addEventListener("click",function(){submitDialog.showModal()}),submitDialog.querySelector(".cancel-score").addEventListener("click",function(){submitDialog.close()}),submitDialog.querySelector(".submit-score").addEventListener("click",function(){for(var e=[],t=[],n=0;n<4;n++)e[n]=""==$("#p"+(n+1)+"cscore").html()?0:parseInt($("#p"+(n+1)+"cscore").html(),10),t[n]=e[n]+parseInt($("#p"+(n+1)+"score").html(),10);dbUpdateScores(e).then(dbFetchPlayers).then(uiUpdateScores),dbUpdateLog(t).then(function(e){uiUpdateLog(t)}),submitDialog.close()}),$(".reset-menu").on("click",function(){resetDialog.showModal()}),$(".reset-score").on("click",function(){playerDB.destroy().then(function(e){return scoreDB.destroy()}).then(function(){initDB(),uiClearLogs(),resetDialog.close()})}),$(".cancel-reset").on("click",function(){resetDialog.close()}),function(){var e,t="";$(".list-player").on("click",function(){e=this.children[0].id,t=$("#"+e).html(),playerDialog.showModal(),uiUpdatePlayerDialog(e)}),$(".cancel-player").on("click",function(){playerDialog.close()}),$(".submit-player").on("click",function(){validateScore(function(){var n=$("#nameInput").val().trim().replace(/\s+/g," ");t!==n&&""!==n&&dbUpdateName(e,n).then(dbFetchPlayers).then(uiUpdateName),uiUpdateCScore(e),playerDialog.close()},toastScoreInvalid)}),$("input[id='nameInput']").on("keyup",function(e){13==e.which&&$(".submit-player").click()}),$("input[id='scoreInput']").on("keyup",function(e){13==e.which&&$(".submit-player").click()})}(),$("#scoreTab").on("click",function(){setTimeout(function(){$("#submitFab").addClass("transition")},500),$("#submitFab").removeClass("hidden")}),$("#logTab").on("click",function(){setTimeout(function(){$("#submitFab").removeClass("transition")},500),$("#submitFab").addClass("hidden")});