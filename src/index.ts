import express, { Request, Response } from 'express'
import cors from 'cors'
import { accounts } from './database'
import { ACCOUNT_TYPE } from './types'

const app = express()

app.use(express.json())
app.use(cors())

app.listen(3003, () => {
    console.log("Servidor rodando na porta 3003")
})

app.get("/ping", (req: Request, res: Response) => {
    res.send("Pong!")
})

app.get("/accounts", (req: Request, res: Response) => {
    res.send(accounts)
})

//==============================================================

app.get("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id
    
    //filter (sempre retorna um array)
    //resultado [0]

    //find (retorna o item ou undefined)

    const result = accounts.find((account) => account.id === id)
    res.status(200).send(result)
})

//===============================================================

//deletar um item do array

app.delete("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id

    //encontrar o indice do item a ser removido
    const indexToRemove = accounts.findIndex((account) => account.id === id)
    
    //só deleter caso o indice seja válido (ou seja, encontrou o item)
    if (indexToRemove >= 0){
        //splice para editar diretamente o array accounts
        //primeiro argumento é o indice alvo
        //segundo argumento é quantos itens serão removidos a partir do alvo
        accounts.splice(indexToRemove, 1)
    }

    res.status(200).send("Item deletado com sucesso")
})


//===========================================================================

//editar algum dado

app.put("/accounts/:id", (req: Request, res: Response) => {
    const id = req.params.id

    const newId = req.body.id as string | undefined
    const newOwnerName = req.body.ownerName as string | undefined
    const newBalance = req.body.balance as number | undefined
    const newType = req.body.type as ACCOUNT_TYPE | undefined

    const account = accounts.find((account) => account.id === id)

    if (account) {
        //account.id = (newId === undefined ? account.id : newId)
        //account.ownerName = (newOwnerName === undefined ? account.ownerName : newOwnerName)
        account.id = newId || account.id
        account.ownerName = newOwnerName || account.ownerName
        account.type = newType || account.type

        account.balance = isNaN(newBalance) ? account.balance : newBalance
    }

    res.status(200).send("Atualização realizada com sucesso")
})