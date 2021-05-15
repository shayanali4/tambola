const hasNumber = value => {
   return new RegExp(/[0-9]/).test(value);
}
const hasMixed = value => {
   return new RegExp(/[a-z]/).test(value) &&
            new RegExp(/[A-Z]/).test(value);
}
const hasSpecial = value => {
   return new RegExp(/[!#@$%^&*)(+=._-]/).test(value);
}
export const strengthObject = count => {
   if (count < 1)
      return {
                  message:'The password is too short',
                  count: count,
                  color : '#FF3739'
              };
  else if (count < 2)
      return {
                  message:'Weak',
                  count: count,
                  color : '#FF3739'
           };
  else if (count < 3)
      return {
                  message:'Weak; try combining letters & numbers',
                  count: count,
                  color : '#D46B08'
            };
   else if (count < 4)
      return {
                  message:'Medium; try using special charecters',
                  count: count,
                  color : ' #00D014'
              };
   else 
      return {
                  message:'Strong password',
                  count: count,
                  color : ' #00D014'
      };
}
export const strengthIndicator = value => {
   let strengths = 0;
   if (value.length > 5)
      strengths++;
   if (value.length > 7)
      strengths++;
   if (hasNumber(value))
      strengths++;
   if (hasSpecial(value))
      strengths++;
   if (hasMixed(value))
      strengths++;
   return strengths;
}
