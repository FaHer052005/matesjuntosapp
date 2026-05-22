export const GS = () => `
  *{
    margin:0;
    padding:0;
    box-sizing:border-box;
  }

  body{
    font-family: Arial, sans-serif;
    background:#F5EEE0;
  }

  button{
    border:none;
    outline:none;
    cursor:pointer;

    padding:12px 18px;

    border-radius:12px;

    background:#2A6041;

    color:white;

    font-weight:bold;

    transition:.2s;
  }

  button:hover{
    opacity:.9;
    transform:scale(1.02);
  }

  input{
    border:1px solid #ddd;

    padding:12px;

    border-radius:12px;

    outline:none;

    min-width:180px;
  }

  input:focus{
    border-color:#2A6041;
  }

  h1{
    color:#1E3D2F;
  }

  ::-webkit-scrollbar{
    width:10px;
  }

  ::-webkit-scrollbar-thumb{
    background:#ccc;
    border-radius:20px;
  }
`;