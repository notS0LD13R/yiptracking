import { useState, useMemo } from "react";
import styles from "./Table.module.css";

type TableProps<T extends { [key: string]: any }> = {
    data: T[];
    columns: TableColumn<T>[];
};

const Table = <T extends { [key: string]: any }>({
    data,
    columns,
}: TableProps<T>) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortKey, setSortKey] = useState("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const sortedData = useMemo(() => {
        let sorted = [...data];
        if (sortKey) {
            sorted.sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];
                if (typeof aValue === "string" && typeof bValue === "string") {
                    return (
                        aValue.localeCompare(bValue) *
                        (sortDirection === "asc" ? 1 : -1)
                    );
                }
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            });
        }
        return sorted;
    }, [data, sortKey, sortDirection]);

    const filteredData = sortedData.filter((item) =>
        columns.some((column) => {
            const itemValue = item[column.key];
            return itemValue
                ?.toString()
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
        })
    );


    const handleSort = (key: string) => {
        setSortDirection(
            sortKey === key && sortDirection === "asc" ? "desc" : "asc"
        );
        setSortKey(key);
    };

    return (
        <div className={styles.tableContainer}>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <table className={styles.table}>
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.key.toString()}
                                onClick={() =>
                                    handleSort(column.key.toString())
                                }
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((row) => (
                        <tr key={row.id}>
                            {columns.map((column) => (
                                <td key={column.key.toString()}>
                                    {row[column.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;