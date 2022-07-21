import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import qs from 'qs';
import * as JSURL from 'jsurl';

/**
 * 
 * @param {*}  key The key of param 
 * @param {*} initSearchParam  Initial value of key param
 * @returns {*} [value, setValue] An array containt value of key and function set value for key
 */
export default function useQueryParam(key, initSearchParam) {
   const [searchParams, setSearchParams] = useSearchParams(initSearchParam);
   const paramValue = searchParams.get(key);

   const value = useMemo(() => {
      return qs.parse(paramValue);  
   }, [paramValue]);
   
   const setValue = useCallback((newObjectValue, optionsNavigate) => {
      const newSearchParam = new URLSearchParams(searchParams);
      newSearchParam.set(key, qs.stringify(newObjectValue));
      setSearchParams(newSearchParam, optionsNavigate);
   }, [key, searchParams, setSearchParams]);

   return [value, setValue];
}