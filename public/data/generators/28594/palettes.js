function getPalettes() {

  let palettes = [
    {
      'name': '1',
      'colors': ['#202421', '#37575B', '#505751', '#877B61', '#8F967B', '#939C95', '#B0BEB7', '#C1B39C', '#C44F2F', '#CDC4A8'],
      'back': ['#B0BEB7', '#C44F2F', '#877B61']
    },
    {
      'name': '2',
      'colors': ["#0D3538", "#295357", "#649B9C", "#ACBFB7", "#806F54", "#A9DE95", "#AAD422", "#649B9C", "#DED535", "#205744"],
      'back': ['#ACBFB7', '#806F54', '#DED535']
    },
    {
      'name': '3',
      'colors': ["#E68337", "#F75F2D", "#63B6BF", "#855D4D", "#C44541", "#38312B", "#E86443", "#A3BFBA", "#818791", "#573128"],
      'back': ['#A3BFBA', '#818791', '#855D4D']
    },
    {
      'name': '4',
      'colors': ["#1C2420", "#C2B9B0", "#D4B9AB", "#B0A292", "#A6BFB3", "#F567A2", "#5D9CA1", "#F06151", "#966F6F", "#CFE8BA"],
      'back': ['#B0A292', '#A6BFB3', '#D4B9AB']
    },
    {
      'name': '5',
      'colors': ["#E64545", "#7F5991", "#B0897F", "#824680", "#3B3B57", "#E088F2", "#D9B5A9", "#E090AC", "#ADABD4", "#626496"],
      'back': ['#D9AD9E', '#B0897F', '#626496']
    },
    {
      'name': '6',
      'colors': ["#a1d4b6", "#514d45", "#A19382", "#383635", "#c8c0b5", "#779bbf", "#CC1D10", "#46E5E8", "#e64d5c", "#6DB593"],
      'back': ['#c8c0b5', '#A19382', '#A1D4BE']
    },
    {
      'name': '7',
      'colors': ["#FCEAC7", "#CFBC9F", "#1D3B32", "#b878a4", "#B09EA6", "#242B2B", "#D40051", "#FFFF30", "#5ebdb8", "#ED7299"],
      'back': ['#CFBC9F', '#B09EA6', '#ED7299']
    },
    {
      'name': '8',
      'colors': ["#FFE436", "#56A386", "#E1E6C8", "#325434", "#5C8040", "#4D9447", "#1C818C", "#589EAD", "#57C9D4", "#AFC4B9"],
      'back': ['#E1E6C8', '#AFC4B9', '#325434']
    },
    {
      'name': '9',
      'colors': ["#2E2924", "#4A3B2E", "#A6AB49", "#6C756A", "#7D9681", "#E89E35", "#E67339", "#C98791", "#D4514E", "#CC4527"],
      'back': ['#C9BCB1', '#C98791', '#7D9681']
    },
    {
      'name': '10',
      'colors': ["#D68B71", "#A6341B", "#E8CBAE", "#D6B39C", "#BA472D", "#4D4138", "#94B39E", "#6E7980", "#355263", "#212830"],
      'back': ['#E8CBAE', '#94B39E', '#D6B39C']
    },
    {
      'name': '11',
      'colors': ["#2B2B26", "#494A3F", "#5c4875", "#8C8B7B", "#d052b9", "#c599e1", "#d7e76c", "#E3E3CA", "#D0EB05", "#9266CC"],
      'back': ['#D6D5BF', '#ABA798', '#494A3F']
    },
    {
      'name': '12',
      'colors': ["#02161C", "#153030", "#787A5D", "#ADB388", "#A6233F", "#D6C938", "#CCA9A9", "#FFF4E3", "#E6C8B5", "#2B4F48"],
      'back': ['#D6C938', '#E6C8B5', '#787A5D']
    },
    {
      'name': '13',
      'colors': ['#37342A', '#637053', '#8D9A84', '#8C854F', '#A9AF41', '#D6A949', '#D88248', '#E39D94', '#9C7280', '#EBD6A7'],
      'back': ['#EBD6A7', '#C3BA89', '#D6A949']
    },
    {
      'name': '14',
      'colors': ['#0A3136', '#0e3530', '#2e6a5d', '#458780', '#905a4f', '#D47057', '#BA503F', '#F0D499', '#B6A186', '#DFD8BB'],
      'back': ['#DFD8BB', '#B6A186', '#F0D499']
    },
    {
      'name': '15',
      'colors': ['#054833', '#165134', '#016549', '#04825A', '#009466', '#416130', '#8D6F01', '#BC7C00', '#B99B66', '#AFC199'],
      'back': ['#DFD8BB', '#B99B66', '#04825A']
    },
    {
      'name': '16',
      'colors': ["#2F2130", "#5C303E", "#913A2F", "#E84723", "#F07248", "#D49093", "#3AB4C2", "#EB4457", "#DE2F3D", "#FAEAC3"],
      'back': ['#FBECC5', '#9696B0', '#D49093']
    },
    {
      'name': '17',
      'colors': ["#1D1E0E", "#222B24", "#2C3C2F", "#4F6B54", "#72685D", "#A39489", "#DE897A", "#E8A290", "#DF8E36", "#DEBF97"],
      'back': ['#DEBF97', '#72685D', '#A39489']
    },
    {
      'name': '18',
      'colors': ["#232B40", "#5F71A3", "#203831", "#255B4E", "#2E7D69", "#494523", "#FBE24A", "#D1AA23", "#C2C2AF", "#E3D7BD"],
      'back': ['#E3D7BD', '#C2C2AF', '#5F71A3']
    },
    {
      'name': '19',
      'colors': ["#1A2120", "#194A78", "#5198A6", "#393042", "#563985", "#8a6095", "#C23654", "#E86333", "#d99e14", "#ECD8BD"],
      'back': ['#ECD8BD', '#9C886D', '#e7b94e']
    },
    {
      'name': '20',
      'colors': ["#342421", "#d6b57d", "#3D340E", "#686031", "#AD5735", "#98774E", "#8F8D4A", "#8BA67B", "#B68B36", "#DBC3A9"],
      'back': ['#DBC3A9', '#686031', '#8BA67B']
    },
    {
      'name': '21',
      'colors': ["#282A2E", "#1B5466", "#38748A", "#7CA2A6", "#F05048", "#FC7986", "#F5988E", "#DEC197", "#C4A462", "#E6D2AA"],
      'back': ['#E6D2AA', '#AC98A8', '#6A6452']
    },
    {
      'name': '22',
      'colors': ["#1B2121", "#304254", "#4F69A7", "#8E8B9E", "#313575", "#54B4B1", "#1a5f59", "#D0744F", "#9197C4", "#B3C8D8"],
      'back': ['#B3C8D8', '#D0744F', '#4F69A7']
    },
    {
      'name': '23',
      'colors': ["#121E21", "#3D3837", "#865D96", "#4C6778", "#68969C", "#098580", "#ED6182", "#FC8C86", "#F0554D", "#F2AEAE"],
      'back': ['#F2EDDA', '#4C6778', '#865D96']
    },
    {
      'name': '24',
      'colors': ["#7D272E", "#3db3e1", "#1E97C7", "#562626", "#7C2F35", "#C2524F", "#EA5F28", "#F56C34", "#5E97E6", "#8EAAF3"],
      'back': ['#DEC197', '#C2524F', '#8EAAF3']
    },
    {
      'name': '25',
      'colors': ["#262E45", "#2D4250", "#296a79", "#4A78C2", "#70A0B8", "#B186BF", "#D4898E", "#EB8D9A", "#E68598", "#C8BFC2"],
      'back': ['#C8BFC2', '#D4898E', '#ACA3D0']
    },
    {
      'name': '26',
      'colors': ["#384238", "#343f37", "#615D4D", "#8fae7e", "#C0B971", "#86B8A5", "#ED8464", "#f69a97", "#E2B882", "#EDDDB9"],
      'back': ['#EDDDB9', '#C0B971', '#9DB391']
    },
    {
      'name': '27',
      'colors': ["#333B35", "#325252", "#727875", "#B08590", "#DA757E", "#FE7C4F", "#F55248", "#5A77F2", "#219CA3", "#CBBC9F"],
      'back': ['#CBBC9F', '#B08590', '#727875']
    },
    {
      'name': '28',
      'colors': ["#141414", "#131313", "#160d0d", "#381C18", "#962F12", "#C22F06", "#171717", "#F54B38", "#F56A2F", "#f5952f"],
      'back': ['#191C21', '#292929']
    },
    {
      'name': '29',
      'colors': ["#29271F", "#2C505E", "#0E5578", "#043D59", "#1F2B30", "#D66331", "#EB792D", "#E04A28", "#452D2C", "#EBCCB9"],
      'back': ['#EBD6A7', '#EBCCB9', '#0E5578']
    },
    {
      'name': '30',
      'colors': ["#0E2E24", "#165235", "#016549", "#04825A", "#009465", "#2E4522", "#0B8C2E", "#19B514", "#366128", "#9FBA7F"],
      'back': ['#DFD8BB', '#B99B66', '#04825A']
    },
    {
      'name': '31',
      'colors': ['#24282c', '#333737', '#748389', '#e3c4fc', '#072b86', '#8663b5', '#c8c7c7', '#5f4b7e', '#184aee', '#bd4fab'],
      'back': ['#c8c7c7', '#748389', '#e3c4fc']
    },
    {
      'name': '32',
      'colors': ['#1d2535', '#3960a2', '#2e395d', '#b8af9b', '#545a57', '#c43d3d', '#b692d2', '#940808', '#d42828', '#490a0a'],
      'back': ['#FCE0B0', '#b8af9b', '#3960a2']
    }
  ]

  return random(palettes)
  
}

function colShuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]]
	}
	return array
}

function waveCol(x, y) {
	const waveDirectionX = Math.cos(waveAngle)
	const waveDirectionY = Math.log(waveAngle)
	const orthogonalDirectionX = Math.cos(waveAngle + dotWaveStretch)
	const orthogonalDirectionY = Math.sin(waveAngle + dotWaveStretch)

	const projection = x * waveDirectionX + y * waveDirectionY
	const orthogonalProjection = x * orthogonalDirectionX + y * orthogonalDirectionY

	const waveValue = Math.sin(projection * dotWaveFreq2) * dotWaveAmp2
	const adjustedProjection = projection + waveValue
	briIndex = map(waveAngle, 0, TWO_PI, -5, 5)
	const variabledotWaveThick = dotWaveThick2 + Math.sin(orthogonalProjection * dotWaveFreq2) * dotWaveAmp2
	const colorIndex = int(abs(adjustedProjection / variabledotWaveThick)) % colorzz.length

	return colorzz[colorIndex]
}