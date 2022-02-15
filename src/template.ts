function replaceVariablesValues(tpl: string, data: any): string {
  return tpl.replace(
    /\{\{(\w+)}}/g,
    (tplMatch, groupValue, matchIndex, str) => {
      if (data.hasOwnProperty(groupValue)) {
        return data[groupValue];
      } else {
        return "";
      }
    }
  );
}

function replaceLoops(tpl: string, data: any): string {
  return tpl.replace(
    /\{\{for (\w+)}}(.+?)\{\{endfor}}/g,
    (tplMatch, groupValue1, subTpl, matchIndex, str) => {
      const arr = data[groupValue1];
      let result = "";
      for (let i = 0; i < arr.length; i++) {
        const subData = arr[i];
        result += template(subTpl, subData);
      }

      return result;
    }
  );
}

export function template(tpl: string, data: any): string {
  return replaceVariablesValues(replaceLoops(tpl, data), data);
}
