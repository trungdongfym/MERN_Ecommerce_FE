import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import qs from 'qs';
import * as JSURL from 'jsurl';

/**
 * 
 * @param {*}  key The key of param 
 * @param {*} initSearchParam  Initial value of key param
 * @param {*} options stringParam: If true return a param as string and don't use parse function of qs
 * @returns {*} [value, setValue] An array containt value of key and function set value for key
 */

export default function useQueryParam(key, initSearchParam, options) {
   const location = useLocation();
   const initSearchParams = new URLSearchParams();

   if (initSearchParam && key !== 'all') {
      if (initSearchParam && typeof initSearchParam === 'object') {
         initSearchParams.set(key, qs.stringify(initSearchParam));
      } else if (initSearchParam) {
         initSearchParams.set(key, initSearchParam);
      }
   }
   // for set all query param
   if (initSearchParam && key === 'all') {
      for (const [key, val] of Object.entries(initSearchParam)) {
         if (val && typeof val === 'object') {
            initSearchParams.set(key, qs.stringify(val));
         } else if (val) {
            initSearchParams.set(key, val);
         }
      }
   }
   // For set all query param

   if (location?.state?.concat) {
      const searchConcat = new URLSearchParams(location.search);
      searchConcat.forEach((val, key) => {
         initSearchParams.set(key, val);
      });
   }

   const [searchParams, setSearchParams] = useSearchParams();
   const paramValue = useMemo(() => {
      if (key === 'all') {
         const allSearchParams = {}
         searchParams.forEach((val, key) => {
            allSearchParams[key] = val;
         });
         return allSearchParams;
      } else if (key !== 'all') {
         return searchParams.get(key);
      }
   }, [searchParams]);

   useEffect(() => {
      initSearchParams.forEach((val, key) => {
         console.log(`Init::${key}:${val}`);
      })

      setSearchParams(initSearchParams);
   }, []);

   const value = useMemo(() => {
      if (key === 'all') {
         const allSearchParams = {}
         for (const [key, val] of Object.entries(paramValue)) {
            const endcodedVal = qs.parse(val);
            // Check val is a string
            const isStringValue = Object.keys(endcodedVal).includes(val);
            allSearchParams[key] = isStringValue ? val : qs.parse(val);
         }
         return allSearchParams;
      } else if (key !== 'all') {
         if (options?.stringParam) {
            return paramValue;
         }
         return qs.parse(paramValue);
      }
   }, [paramValue]);

   const setValue = useCallback((newValue, optionsNavigate) => {
      console.log(`new val:`, newValue);
      searchParams.forEach((val, key) => {
         console.log('ok');
         console.log(`searchParam::${key}:${val}`);
      })
      const newSearchParam = new URLSearchParams(searchParams);

      let newParamStr = newValue;
      // Check new value is string
      if (typeof newValue === 'object') {
         newParamStr = qs.stringify(newValue);
      }

      if (key !== 'all') {
         newSearchParam.set(key, newParamStr);
      }

      if (key === 'all' && typeof newValue === 'object') {
         for (const [key, val] of Object.entries(newValue)) {
            // console.log(val);
            if (typeof val === 'object') {
               newSearchParam.set(key, qs.stringify(val));
            } else {
               newSearchParam.set(key, val);
            }
         }
      }

      if (!newValue) {
         newSearchParam.delete(key);
      }

      setSearchParams(newSearchParam, optionsNavigate);
   }, [key, searchParams, setSearchParams]);

   return [value, setValue];
}