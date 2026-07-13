// 魔導書クエスト帳
class TodoList {


    constructor(){


        // DOM取得
        this.taskInput = document.getElementById('questInput');
        this.addButton = document.getElementById('addButton');
        this.taskList = document.getElementById('questList');
        this.questType = document.getElementById('questType');



        // 保存データ読み込み
        this.tasks =
        JSON.parse(localStorage.getItem('tasks')) || [];


        this.level =
        Number(localStorage.getItem('level')) || 1;


        this.exp =
        Number(localStorage.getItem('exp')) || 0;



        // イベント
        this.addButton.addEventListener(
            'click',
            ()=>this.addTask()
        );


        this.taskInput.addEventListener(
            'keypress',
            (e)=>{
                if(e.key === "Enter"){
                    this.addTask();
                }
            }
        );



        // 日課リセット
        this.resetDailyQuest();


        // 表示
        this.renderTasks();
        this.updateStatus();

    }





    // クエスト追加
    addTask(){


        const taskText =
        this.taskInput.value.trim();



        if(taskText){


            const type =
            this.questType.value;



            let exp = 10;



            if(type === "study"){

                exp = 30;

            }
            else if(type === "magic"){

                exp = 50;

            }



            this.tasks.push({


                id: Date.now(),

                text: taskText,

                type:type,

                exp:exp,

                completed:false,

                lastCompleted:null

            });



            this.taskInput.value = "";



            this.saveTasks();

            this.renderTasks();


        }

    }





    // クエスト削除
    deleteTask(id){


        this.tasks =
        this.tasks.filter(
            task=>task.id !== id
        );


        this.saveTasks();

        this.renderTasks();


    }







    // 達成チェック
    toggleTask(id){


        const task =
        this.tasks.find(
            task=>task.id === id
        );



        if(task){



            // 未達成→達成の場合
            if(!task.completed){



                const today =
                new Date().toDateString();



                // 日課は1日1回
                // その他は何度でもOK
                if(
                    task.type !== "daily" ||
                    task.lastCompleted !== today
                ){


                    this.gainExp(task.exp);


                    task.lastCompleted = today;


                }


            }



            task.completed =
            !task.completed;



            this.saveTasks();

            this.renderTasks();



        }


    }






    // クエスト保存
    saveTasks(){

        localStorage.setItem(
            "tasks",
            JSON.stringify(this.tasks)
        );

    }







    // 日課リセット
    resetDailyQuest(){


        const today =
        new Date().toDateString();



        this.tasks.forEach(task=>{


            if(
                task.type === "daily" &&
                task.lastCompleted !== today
            ){


                task.completed = false;


            }


        });



        this.saveTasks();


    }








    // EXP獲得
    gainExp(amount){


        const before =
        this.getRank();



        this.exp += amount;




        if(this.exp >= 100){



            this.level++;

            this.exp -= 100;



            const after =
            this.getRank();





            if(before.name !== after.name){


                alert(

                "📜 魔導書が輝いている...\n\n" +

                "✨ 新しい階級を獲得！ ✨\n\n" +

                after.icon +
                " " +
                after.name

                );


            }
            else{


                alert(

                "✨ レベルアップ！✨\n\n" +

                "Lv." +
                this.level +
                " になった！"

                );


            }



        }



        this.saveStatus();

        this.updateStatus();


    }








    // レベル保存
    saveStatus(){


        localStorage.setItem(
            "level",
            this.level
        );


        localStorage.setItem(
            "exp",
            this.exp
        );


    }









    // 魔女ランク
    getRank(){



        if(this.level <=5){

            return {
                name:"魔女見習い",
                icon:"🌱"
            };

        }
        else if(this.level <=10){

            return {
                name:"薬草魔女",
                icon:"🌿"
            };

        }
        else if(this.level <=20){

            return {
                name:"新米魔女",
                icon:"🧹"
            };

        }
        else if(this.level <=35){

            return {
                name:"初級魔女",
                icon:"📖"
            };

        }
        else if(this.level <=50){

            return {
                name:"中級魔女",
                icon:"🔮"
            };

        }
        else if(this.level <=70){

            return {
                name:"一人前魔女",
                icon:"✨"
            };

        }
        else if(this.level <=90){

            return {
                name:"大魔女",
                icon:"🪄"
            };

        }
        else if(this.level <100){

            return {
                name:"月影魔女",
                icon:"🌙"
            };

        }
        else{

            return {
                name:"星詠みの魔女",
                icon:"💫"
            };

        }


    }








    // クエストアイコン
    getQuestIcon(type){


        if(type==="daily"){

            return "🌱";

        }


        if(type==="study"){

            return "📖";

        }


        if(type==="magic"){

            return "🪄";

        }


        return "📜";


    }








    // ステータス表示
    updateStatus(){



        const rank =
        this.getRank();



        document.getElementById("level").textContent =

        rank.icon +
        " Lv." +
        this.level +
        " " +
        rank.name;




        document.getElementById("expText").textContent =

        "EXP " +
        this.exp +
        " / 100";




        document.getElementById("expBar").style.width =

        this.exp + "%";



    }








    // クエスト表示
    renderTasks(){



        this.taskList.innerHTML = "";



        this.tasks.forEach(task=>{



            const li =
            document.createElement("li");



            li.className =
            `task-item ${task.completed ? "completed":""}`;





            const checkbox =
            document.createElement("input");


            checkbox.type="checkbox";


            checkbox.checked =
            task.completed;



            checkbox.addEventListener(
                "change",
                ()=>this.toggleTask(task.id)
            );





            const text =
            document.createElement("span");


            text.className =
            "task-text";



            text.textContent =

            this.getQuestIcon(task.type)
            +
            " "
            +
            task.text;





            const button =
            document.createElement("button");


            button.className =
            "delete-button";


            button.textContent =
            "削除";



            button.addEventListener(
                "click",
                ()=>this.deleteTask(task.id)
            );





            li.appendChild(checkbox);

            li.appendChild(text);

            li.appendChild(button);



            this.taskList.appendChild(li);



        });



    }



}





// 起動
document.addEventListener(
"DOMContentLoaded",
()=>{

    new TodoList();

});