import React, { Fragment, useMemo, useState } from "react";
import { useTable, useFilters, useGlobalFilter, useAsyncDebounce, usePagination, useSortBy, useExpanded } from 'react-table';
import { Link, useNavigate } from "react-router-dom";
import styles from './PaginationTable.module.css';
import AnimatedNumber from "animated-number-react";
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

function Table({ columns, data, sizePagination, atPage }) {
  const { t } = useTranslation('paginationTable');
  const defaultColumn = React.useMemo(
    () => ({
      Filter: ColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    rows,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: atPage, pageSize: sizePagination },
      defaultColumn
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    useExpanded,
    usePagination,
  );

  return (
    <div className={styles['PaginationTable-component']}>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      <table className="table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <Fragment key={'headGroup-' + i}>
              {/* Add a sort direction indicator */}
              <tr {...headerGroup.getHeaderGroupProps()} key={"sortCol-" + i}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    {/* Add a sort direction indicator */}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>

              {/* Render the columns filter UI */}
              <tr {...headerGroup.getHeaderGroupProps()} key={"searchCol-" + i}>
                {headerGroup.headers.map((column, i) => (
                  <td {...column.getHeaderProps()} key={'searchCol-td-' + i}>
                    {/* Render the columns filter UI */}
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </td>
                ))}
              </tr >
            </Fragment>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  if (cell.column.Header === t('colDetail.label')) {
                    return <td {...cell.getCellProps()}>
                      {!cell.row.id.includes('.') &&
                        <Link to={"/team/show/" + cell.row.original.id} state={cell.row.original}>🔎</Link>
                      }
                    </td>
                  }

                  if (cell.column.Header === t('colMoneyBalance.label')) {
                    return <td {...cell.getCellProps()}>
                      <AnimatedNumber
                        value={cell.render('Cell').props.cell.row.original[cell.render('Cell').props.cell.column.id]}
                        formatValue={(value) => value.toFixed(2)}
                      />
                    </td>
                  }

                  if (cell.column.Header === t('colTotalPlayers.label')) {
                    return <td {...cell.getCellProps()}>
                      <AnimatedNumber
                        value={cell.render('Cell').props.cell.row.original[cell.render('Cell').props.cell.column.id]}
                        formatValue={(value) => value.toFixed(0)}
                      />
                    </td>
                  }

                  return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <ul className={styles.pagination + ' pagination'}>
        <li className="page-item" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          <a className="page-link">{t('paginate.first')}</a>
        </li>
        <li className="page-item" onClick={() => previousPage()} disabled={!canPreviousPage}>
          <a className="page-link">{t('paginate.prev')}</a>
        </li>
        <li className="page-item" onClick={() => nextPage()} disabled={!canNextPage}>
          <a className="page-link">{t('paginate.next')}</a>
        </li>
        <li className="page-item" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          <a className="page-link">{t('paginate.last')}</a>
        </li>

        {/* Current page number */}
        <li>
          <a className="page-link">
            {t('paginate.currentPage.1') + ' '}
            <strong>
              {pageIndex + 1} {t('paginate.currentPage.2')} {pageOptions.length}
            </strong>{' '}
          </a>
        </li>

        {/* Got to page number */}
        <li>
          <a className="page-link" style={{ 'height': '100%' }}>
            <input
              className="form-control"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px', height: '20px' }}
            />
          </a>
        </li>{' '}

        {/* Page size */}
        <select
          className="form-control"
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
          style={{ width: '120px', height: '38px' }}
        >
          {[5, 10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              {t('paginate.showSize')} {pageSize}
            </option>
          ))}
        </select>
      </ul>
    </div >
  )
}

function PaginationTable({
  data, sizePagination, atPage
}) {
  const translator = { paginationTable: useTranslation('paginationTable') };
  const tpaginationTable = translator.paginationTable.t;
  const columns = useMemo(
    () => [
      {
        Header: tpaginationTable('tableLabel'),
        columns: [
          {
            Header: tpaginationTable('colTeamName.label'),
            accessor: 'name',
          },
          {
            Header: tpaginationTable('colCountry.label'),
            accessor: 'country',
          },
          {
            Header: tpaginationTable('colMoneyBalance.label'),
            accessor: 'moneyBalance',
          },
          {
            Header: tpaginationTable('colTotalPlayers.label'),
            accessor: 'totalPlayers',
          },
          // {
          //   Header: 'Players',
          //   accessor: 'players',
          // },
          {
            Header: tpaginationTable('colDetail.label'),
            accessor: 'detail',
            disableFilters: true
          },
        ],
      },
    ],
  )

  return (
    <Table columns={columns} data={data} sizePagination={sizePagination} atPage={atPage} />
  )
}

// Search bar
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const { t } = useTranslation('paginationTable');
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce(value => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      <h3>{t('searchBar.label')}</h3>
      <input
        className={styles.searchBar + " form-control"}
        value={value || ""}
        onChange={e => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={t('searchBar.placeHolderFilter').replace('{{count}}', count)}
      />
    </span>
  )
}

// Search filter for each column
function ColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      className={styles.searchBar + " form-control"}
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

export default PaginationTable;