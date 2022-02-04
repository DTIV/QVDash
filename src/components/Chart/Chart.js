import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import React from 'react';

const Chart = (props) => {
    const propsArray = props.allProps
    const data = []
    for(let i=0;i < propsArray.length; i++){
        const temp = {}
        if((Number(propsArray[i].upVotes) || Number(propsArray[i].downVotes)) > 0){
            temp["name"] = Number(propsArray[i].pid)
            temp["up"] = Number(propsArray[i].upVotes)
            temp["down"] = Number(propsArray[i].downVotes)
            data.push(temp)
        }
    }
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
            width={500}
            height={300}
            data={data}
            margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="down" stackId="a" fill="#d88484" />
            <Bar dataKey="up" stackId="a" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default Chart;
