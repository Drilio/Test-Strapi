async function main(){
    try{
        const responseToken = await fetch('http://127.0.0.1:1337/api/auth/local',{
        method:'POST',
        headers:{
            'Accept': 'application/json',
            'Content-type':'application/json'
        },
        body: JSON.stringify(
            {
                identifier:"toto@gmail.com",
                password:"totoisgod"
            })
        });

        if(responseToken.ok){
            const data = await responseToken.json();
            console.log("jwt", data.jwt);
            try{
                const responseMovie = await fetch('https://api.themoviedb.org/3/search/movie?api_key=971401e45cdeaa2392c2dee4b2f81054&query=H*');
                const movies = await responseMovie.json();
                
                let actorsName = 'Jojo';
                let actorsLastNAme = 'Survivor';

                const createActor = await fetch('http://localhost:1337/api/actors',{
                    method:'POST',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.jwt}`
                    },
                    body: JSON.stringify(
                        {
                            data:{
                                "firstname": actorsName,
                                "lastname" : actorsLastNAme
                            }
                        }
                    )
                })
                let responseActor = await createActor.json();
                console.log('--------------------response Actor----------------------------------:',responseActor);
                
                
                
                for(let movie of movies.results){
                    let title = movie.title;
                    let  description = movie.overview;
                    let director = 'Steven P.';
                    let releaseDate = movie.release_date;
                    let actor = [1];

                    const creatMovie = await fetch('http://localhost:1337/api/movies',{
                        method:'POST',
                        headers:{
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${data.jwt}`
                        },
                        body: JSON.stringify(
                            {
                                data:{
                                    "ReleaseDate": releaseDate,
                                    "description": description,
                                    "title": title,
                                    "director": director,
                                    "actor": actor
                                }
                            }
                        )
                    })
                    let responseCreateMovie = await creatMovie.json();
                    console.log('-------------------------CreateMovie:--------------------------',responseCreateMovie);                   
                }

                const findActor = await fetch('http://localhost:1337/api/actors',{
                    method:'GET',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.jwt}`
                    }
                })
                let responseFindActor = await findActor.json();
                console.log('------------------Reponse Find Actor---------------', responseFindActor);
                let actorId = responseFindActor.data[0].id;
                console.log('actorId', actorId);

                const modifActor = await fetch(`http://localhost:1337/api/actors/${actorId}`,{

                method:'PUT',
                headers:{
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${data.jwt}`
                },
                body:JSON.stringify({
                    data:{
                            "firstname":"Pom",
                            "lastname":"Banks"
                    }
                })
                })
                let responseModifActor = await modifActor.json();
                console.log('-----------------Modif actor--------------------- :' ,responseModifActor);

                const getMovieStartingWithH = await fetch('http://localhost:1337/api/movies?filters[title][$startsWithi]=h',{
                    method:'GET',
                    headers:{
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${data.jwt}`
                    }
                })
                let responseGetMovieStartinWithH = await getMovieStartingWithH.json();
                console.log("----------------------Response Get Movie Startin with H :------------------ ");
                responseGetMovieStartinWithH.data.forEach(movie => {
                    const title = movie.attributes.title;
                    console.log('Title:', title);
                  });
                        
            }catch(e){
                console.log('ERROR', e);
            }
        }
    }catch(e){
        console.log(e);
    }
    


    
    
    
}

main()