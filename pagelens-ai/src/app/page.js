"use client";

import { useState }
from "react";

export default function Home(){

const [url,setUrl]=useState("");

const [data,setData]=useState(null);

const [loading,setLoading]=
useState(false);

async function audit(){

setLoading(true);

const res =
await fetch("/api/audit",{

method:"POST",

headers:{
"Content-Type":
"application/json"
},

body:
JSON.stringify({url})

});

const result =
await res.json();

setData(result);

setLoading(false);

}

return(

<div className="min-h-screen p-20">

<h1 className="text-4xl font-bold">

PageLens AI

</h1>

<input

className="border p-3 mt-6 w-full"

placeholder="Enter URL"

onChange={(e)=>
setUrl(e.target.value)
}

/>

<button

onClick={audit}

className="bg-black text-white px-6 py-3 mt-4"

>

Audit Page

</button>

{loading &&

<p className="mt-6">

Analyzing...

</p>

}

{data &&

<pre className="mt-10">

{JSON.stringify(data,null,2)}

</pre>

}

</div>

);

}