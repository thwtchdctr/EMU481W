
export async function POST(req){
    const data = await req.json();

    const {name, password, email, keywords} = data;

    return new Response(JSON.stringify({message:'User authenticated successfully'}));
}

