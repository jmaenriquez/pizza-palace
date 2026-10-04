export const BASE_URL = 'http://localhost:3000'


export async function refreshToken(){
    
    const response = await fetch(`${BASE_URL}/refresh`, {
        method: 'POST',
        credentials: 'include'
    });
    
    if(!response.ok){
        const tokenError = await response.json();
        throw new Error(tokenError.error || 'Session expired or invalid');
    }
    
    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    
    return data.accessToken;
}


export async function authFetch(url:string, http:{method:string, headers:{}, body:string } ){

    let token = localStorage.getItem('accessToken')

    let response = await fetch(url, {
        ...http,
        headers: {...http.headers, 'Authorization' : `Bearer ${token}` },
        credentials: 'include'
    })

    if(response.status === 401){
        try{
            token = await refreshToken()
        }catch(err){

            localStorage.removeItem('accessToken')
            window.location.href = '/login'
            throw err
        }
    }
    response = await fetch(url, {
        ...http,
        headers: {...http.headers, 'Authorization' : `Bearer ${token}`},
        credentials: 'include'
    })

    return response
}

