import {formatISO9075} from 'date-fns'
export default function Post({title, summary, cover, content, createdAt}){
    return(
       
      <div className = "post">
      <div className="image">
        <img src="https://imgs.search.brave.com/-zhYr-__chwocwaLLbuMMDm87G6vbQlSDE0QTMgpxew/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvNDg2/Mzg4MDEwL3Bob3Rv/L2xhbWJvcmdoaW5p/LWF2ZW50YWRvci1s/cDcwMC00LXN1cGVy/Y2FyLW1vZGVsLWNh/ci5qcGc_cz02MTJ4/NjEyJnc9MCZrPTIw/JmM9TDExQkQ2LUhr/UTZUcGFaUkVhVjNf/akVTUThlWFAtZG5H/eWFQNWEzaXBEdz0" alt="img1"></img>
        </div>
        <div className="texts">
          <h2>{title}</h2>
          <p className = "info">
            <a className="author">reetika</a>
            <time>{formatISO9075(new Date(createdAt))}</time>
          </p>
          <p className="summary">{summary}</p>
        </div>
      </div>
     
    );
}