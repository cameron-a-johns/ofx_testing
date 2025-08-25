import classes from './Table.module.css';

const Table = (props) => {
    return (
        <table className={`${classes.table} ${props.className}`} style={props.style}>
            {props.label && <caption>{props.label}</caption>}
            {props.headers && (
                <thead>
                    <tr>
                        {props.headers.map((item) => (
                            <th key={`${item.key}-header`}>{item.label}</th>
                        ))}
                    </tr>
                </thead>
            )}
            {props.data && props.headers && props.headers.length > 0 && (
                <tbody>
                    {props.data.map((item) => (
                        <tr key={item.key}>
                            {props.headers.map((header) => (
                                <td key={`${header.key}-${item.key}`}>{item[header.key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            )}
        </table>
    )
}

// Table.propTypes = {
//     data: PropTypes.array,
//     headers: PropTypes.array,
//     label: PropTypes.string,
//     className: PropTypes.string,
//     style: PropTypes.object,
// };

export default Table;