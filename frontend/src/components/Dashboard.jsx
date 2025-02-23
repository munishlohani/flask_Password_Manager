import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import api from '../api'

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [password, setPassword] = useState([]);

    const nav = useNavigate();

    useEffect(() => {
        const auth = async () => {
            try {
                const response = await api.get("/dashboard");
                console.log(response.data);

                if (response.status === 200) {
                    setData(response.data);
                    setPassword(response.data.passwords);
                } else {
                    nav("/");
                }
            } catch (e) {
                console.log(e);
                nav("/")
            }
        };

        auth();
    }, [nav]);

    return (
        <div>
            <h1>Dashboard</h1>
            {data && (
                <div>
                    {password && password.length > 0 && (
                        <p>Passwords: {JSON.stringify(password)}</p>
                    )}
                </div>
            )}
        </div>
    );
}
