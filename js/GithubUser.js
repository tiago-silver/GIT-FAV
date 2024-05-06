export class GithubUser{
    static search(userName){
        const endPoint = `https://api.github.com/users/${userName}`

       return fetch(endPoint).then(data => data.json()).then(data => ({
            name: data.name,
            login: data.login,
            repositores: data.public_repos,
            followers: data.followers
        }))
        
    }
}