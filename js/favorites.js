import { GithubUser } from "./GithubUser.js";
export class Favorites {
    constructor(root){
        this.root = document.querySelector(root);
        
        this.load()
        
    }

    load(){
        this.entries = JSON.parse( localStorage.getItem("@github-favorites") ) || []

        // if(this.entries.length === 0){
        //     console.log("string not found")
        // }else{
            
        // }
        
    }
    async add(userName){
        try{
            const userExists = this.entries.find(entry => entry.login === userName.toLowerCase());

            if(userExists){
                throw new Error(`O usuário(a) ${userName} já existe!`)
            }

            const user = await GithubUser.search(userName)
            if(user.login === undefined){
                throw new Error("Usuário não encontrado")
            }
            console.log(user)
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

        }catch(e){
            alert(e.message);
        }
    }

    save(){
        localStorage.setItem("@github-favorites", JSON.stringify(this.entries))
    }

    delete(user){
        const filteredUser = this.entries.filter(entry => entry.login !== user.login)
       

        this.entries = filteredUser
        this.update()
        this.save()
    }
}


export class FavoritesView extends Favorites{
    constructor(root){
        super(root)
        this.tbody = document.querySelector("table tbody")
        

        this.update()
        this.onAdd()

    }

    onAdd(){
        const addButton = this.root.querySelector(".inputs button")
        addButton.onclick = () => {
            const { value} = this.root .querySelector(".inputs input ")
            this.add(value)
            
        }
    }

    
    update(){
         this.removeAllTr();
        if(this.entries.length === 0){
            const tr = this.createEmptyRow()
            this.tbody.appendChild(tr)
        }
         
        this.entries.forEach( user => {
            const row = this.createRow()
            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `Imagem do(a) ${user.name}`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user p").textContent = user.name
            row.querySelector(".user span").textContent = `/${user.login}`
            row.querySelector(".repositores").textContent = user.repositores
            row.querySelector(".followers").textContent = user.followers

            row.querySelector(".remove").onclick = () =>{
                const isOk = confirm(`Tem certeza que deseja excluir usuário(a) ${user.name} ?`)

                if(isOk){
                    this.delete(user)

                }
            }
            

            this.tbody.appendChild(row)
        })

        
        
    }
    createRow(){
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td data-label = "Usuário" class="user"> <div class = "user-wrap">
        <img src="https://github.com/tiago-silver.png" alt="Imagem do Tiago Luiz Pereira Silva">
       <a href="" target = "blank">
        <p >
            Tiago Silva
        </p>
        <span>/tiago-silver</span>
       </a>
       </div>
       </td>
       <td data-label = "Repositórios" class = "repositores">56</td>
       <td data-label = "Seguidores" class = "followers">100</td>
       <td data-label = "Ação">
            <button class="remove">Remover</button>
        </td>
        `
        return tr
    }
    createEmptyRow(){
        const tr = document.createElement("tr")
        tr.innerHTML = `
        <td class ="td-empty">
            <div class = "text-empty">
            <img src="./assets/logoEmpty.svg" alt="">
            <p>Nenhum favorito ainda</p>
            </div>
        </td>
        `
        return tr
    }

    removeAllTr(){
        this.tbody.querySelectorAll("tr").forEach( tr => {
            tr.remove()
        })
    }
}